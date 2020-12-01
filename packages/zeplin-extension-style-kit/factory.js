import {
    getResources,
    getFontFaces,
    getUniqueLayerTextStyles,
    selectorize,
    isHtmlTag,
    getParams,
    generateIdentifier
} from "./utils";
import Color from "./values/color";
import FontFace from "./elements/fontFace";
import TextStyle from "./elements/textStyle";
import Layer from "./elements/layer";
import RuleSet from "./ruleSet";
import Mixin from "./declarations/mixin";
import Length from "./values/length";

const hasSameName = (a, b) => generateIdentifier(a.name) === generateIdentifier(b.name);

const isFirstItem = (color, i, array) => i === array.findIndex(searchedColor => hasSameName(color, searchedColor));

const colorsFactory = ({
    language,
    createGenerator,
    options: {
        prefix = "",
        separator = "\n",
        suffix = ""
    } = {},
    isColorsFromParam
}) => (context, colorsParam) => {
    const params = getParams(context);
    const generator = createGenerator(context, params);
    const allColors = isColorsFromParam
        ? colorsParam
        : getResources({ context, useLinkedStyleguides: params.useLinkedStyleguides, key: "colors" });
    const uniqueColors = allColors.filter(isFirstItem);
    const code = `${prefix}${uniqueColors.map(c => generator.variable(c.name, new Color(c))).join(separator)}${suffix}`;

    return {
        code,
        language
    };
};

const textStylesFactory = ({
    language,
    createGenerator,
    options: {
        prefix = "",
        separator = "\n\n",
        fontFaceSeparator = separator,
        textStyleSeparator = separator,
        suffix = ""
    } = {},
    isTextStylesFromParam
}) => (context, textStylesParam) => {
    const params = getParams(context);
    const generator = createGenerator(context, params);
    const textStyles = isTextStylesFromParam
        ? textStylesParam
        : getResources({ context, useLinkedStyleguides: params.useLinkedStyleguides, key: "textStyles" });

    const uniqueTextStyles = textStyles.filter(isFirstItem);
    const fontFaces = getFontFaces(uniqueTextStyles);

    const fontFaceCode = fontFaces.map(ts => {
        const { style } = new FontFace(ts);

        return generator.atRule(style);
    }).join(fontFaceSeparator);

    const textStyleCode = uniqueTextStyles.map(t => {
        const { style } = new TextStyle(t);

        return generator.ruleSet(style, { mixin: params.useMixin });
    }).join(textStyleSeparator);

    return {
        code: `${prefix}${fontFaceCode}${separator}${textStyleCode}${suffix}`,
        language
    };
};

const useRemUnitForMeasurement = ({ useForMeasurements }) => useForMeasurements;

const spacingFactory = ({
    language,
    createGenerator,
    options: {
        prefix = "",
        separator = "\n",
        suffix = ""
    } = {}
}) => context => {
    const params = getParams(context);
    const cssGenerator = createGenerator(context, params);
    const spacingSections = getResources({ context, useLinkedStyleguides: params.useLinkedStyleguides, key: "spacingSections" });
    const spacingTokens = spacingSections
        .map(({ spacingTokens: items }) => items)
        .reduce((prev, current) => [...prev, ...current])
        .filter(isFirstItem);

    const code = `${prefix}${
        spacingTokens
            .map(({ name, value }) => cssGenerator.variable(
                name,
                new Length(value, { useRemUnit: useRemUnitForMeasurement, useDensityDivisor: false })),
            )
            .join(separator)
    }${suffix}`;
    return {
        code,
        language
    };
};

const layerFactory = ({
    language,
    createGenerator,
    options: {
        separator = "\n\n"
    } = {}
}) => (context, selectedLayer) => {
    const params = getParams(context);
    const { useMixin } = params;
    const generator = createGenerator(context, params);

    const l = new Layer(selectedLayer, params);
    const layerRuleSet = l.style;
    const childrenRuleSet = [];
    const { defaultTextStyle } = selectedLayer;

    if (selectedLayer.type === "text" && defaultTextStyle) {
        const textStyles = getResources({
            context,
            useLinkedStyleguides: params.useLinkedStyleguides,
            key: "textStyles"
        }).filter(isFirstItem);
        const containerTextStyle = textStyles.find(textStyle => defaultTextStyle.conforms(textStyle));

        const declarations = l.getLayerTextStyleDeclarations(defaultTextStyle);
        const textStyleName = containerTextStyle && containerTextStyle.name;

        if (useMixin && textStyleName && !isHtmlTag(selectorize(textStyleName))) {
            const mixinRuleSet = new RuleSet("mixin", l.getLayerTextStyleDeclarations(containerTextStyle));

            declarations.forEach(d => {
                if (!mixinRuleSet.hasProperty(d.name)) {
                    layerRuleSet.addDeclaration(d);
                }
            });

            layerRuleSet.addDeclaration(new Mixin(selectorize(textStyleName).replace(/^\./, "")));
        } else {
            declarations.forEach(d => layerRuleSet.addDeclaration(d));
        }

        getUniqueLayerTextStyles(selectedLayer).filter(
            textStyle => !defaultTextStyle.equals(textStyle)
        ).forEach((textStyle, idx) => {
            childrenRuleSet.push(
                new RuleSet(
                    `${selectorize(selectedLayer.name)} ${selectorize(`text-style-${idx + 1}`)}`,
                    l.getLayerTextStyleDeclarations(textStyle)
                )
            );
        });
    }

    const layerStyle = generator.ruleSet(layerRuleSet);
    const childrenStyles = childrenRuleSet.map(
        s => generator.ruleSet(s, { parentDeclarations: layerRuleSet.declarations })
    );

    return {
        code: [layerStyle, ...childrenStyles].join(separator),
        language
    };
};

const comment = (context, text) => `/* ${text} */`;

const exportColorsFactory = ({
    colors,
    options: {
        prefix = "",
        suffix = ""
    } = {}
}) => (context, colorsParam) => {
    const { code, language } = colors(context, colorsParam);
    return {
        code: `${prefix}${code}${suffix}`,
        filename: `colors.${language}`,
        language
    };
};

const exportTextStylesFactory = ({
    textStyles,
    options: {
        prefix = "",
        suffix = ""
    } = {}
}) => (context, textStylesParam) => {
    const { code, language } = textStyles(context, textStylesParam);
    return {
        code: `${prefix}${code}${suffix}`,
        filename: `fonts.${language}`,
        language
    };
};

const exportSpacingFactory = ({
    spacing,
    options: {
        prefix = "",
        suffix = ""
    } = {}
}) => context => {
    const { code, language } = spacing(context);
    return {
        code: `${prefix}${code}${suffix}`,
        filename: `spacing.${language}`,
        language
    };
};

export const extensionFactory = ({
    language,
    Generator,
    colorsOptions,
    textStylesOptions,
    spacingOptions,
    layerOptions,
    exportColorsOptions,
    exportTextStylesOptions,
    exportSpacingOptions
}) => {
    const getVariableMap = containerColors => {
        const variables = {};

        containerColors.forEach(containerColor => {
            // Colors are sorted by their priorities; so, we don't override already set colors
            const colorValue = new Color(containerColor).valueOf();
            variables[colorValue] = variables[colorValue] ? variables[colorValue] : containerColor.name;
        });

        return variables;
    };

    const createGenerator = (context, params) => {
        const containerColors = getResources({ context, useLinkedStyleguides: params.useLinkedStyleguides, key: "colors" });
        const uniqueColors = containerColors.filter(isFirstItem);
        return new Generator(getVariableMap(uniqueColors), params);
    };

    const colors = colorsFactory({ language, createGenerator, options: colorsOptions });
    const textStyles = textStylesFactory({ language, createGenerator, options: textStylesOptions });
    const spacing = spacingFactory({ language, createGenerator, options: spacingOptions });
    const layer = layerFactory({ language, createGenerator, options: layerOptions });
    const exportColors = exportColorsFactory({ colors, options: exportColorsOptions });
    const exportTextStyles = exportTextStylesFactory({ textStyles, options: exportTextStylesOptions });
    const exportSpacing = exportSpacingFactory({ spacing, options: exportSpacingOptions });
    const styleguideColors = colorsFactory({
        language,
        createGenerator,
        options: colorsOptions,
        isColorsFromParam: true
    });
    const styleguideTextStyles = textStylesFactory({
        language,
        createGenerator,
        options: textStylesOptions,
        isTextStylesFromParam: true
    });
    const exportStyleguideColors = exportColorsFactory({ colors: styleguideColors, options: exportColorsOptions });
    const exportStyleguideTextStyles = exportTextStylesFactory({
        textStyles: styleguideTextStyles,
        options: exportTextStylesOptions
    });
    return ({
        colors,
        textStyles,
        spacing,
        layer,
        comment,
        exportColors,
        exportTextStyles,
        exportSpacing,
        styleguideColors,
        styleguideTextStyles,
        exportStyleguideColors,
        exportStyleguideTextStyles
    });
};
