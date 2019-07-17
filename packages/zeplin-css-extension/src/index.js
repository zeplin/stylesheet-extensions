import Layer from "zeplin-extension-style-kit/elements/layer";
import FontFace from "zeplin-extension-style-kit/elements/fontFace";
import TextStyle from "zeplin-extension-style-kit/elements/textStyle";
import Color from "zeplin-extension-style-kit/values/color";
import RuleSet from "zeplin-extension-style-kit/ruleSet";
import {
    getUniqueLayerTextStyles,
    selectorize,
    getResourceContainer,
    getResources,
    getFontFaces
} from "zeplin-extension-style-kit/utils";

import CssGenerator from "./generator";
import { COPYRIGHT, LANG, OPTION_NAMES } from "./constants";

function getVariableMap(containerColors, params) {
    const variables = {};

    containerColors.forEach(containerColor => {
        // Colors are sorted by their priorities; so, we don't override already set colors
        const colorValue = new Color(containerColor).valueOf();
        variables[colorValue] = variables[colorValue] ? variables[colorValue] : containerColor.name;
    });

    return variables;
}

function createGenerator(context, params) {
    const { container, type } = getResourceContainer(context)
    const containerColors = getResources(container, type, params.useLinkedStyleguides, "colors");
    return new CssGenerator(getVariableMap(containerColors, params), params);
}

function getParams(context) {
    const { container } = getResourceContainer(context);
    return {
        densityDivisor: container.densityDivisor,
        useLinkedStyleguides: context.getOption(OPTION_NAMES.USE_LINKED_STYLEGUIDES),
        colorFormat: context.getOption(OPTION_NAMES.COLOR_FORMAT),
        showDimensions: context.getOption(OPTION_NAMES.SHOW_DIMENSIONS),
        showDefaultValues: context.getOption(OPTION_NAMES.SHOW_DEFAULT_VALUES),
        unitlessLineHeight: context.getOption(OPTION_NAMES.UNITLESS_LINE_HEIGHT)
    };
}

function colors(context) {
    const params = getParams(context);
    const cssGenerator = createGenerator(context, params);
    const { container, type } = getResourceContainer(context);
    const allColors = getResources(container, type, params.useLinkedStyleguides, "colors");
    const code = `:root {\n${allColors.map(c => `  ${cssGenerator.variable(c.name, new Color(c))}`).join("\n")}\n}`;

    return {
        code,
        language: LANG
    };
}

function textStyles(context) {
    const params = getParams(context);
    const cssGenerator = createGenerator(context, params);
    const { container, type } = getResourceContainer(context);
    const textStyles = getResources(container, type, params.useLinkedStyleguides, "textStyles");
    const fontFaces = getFontFaces(allTextStyles);

    const fontFaceCode = fontFaces.map(ts => {
        const { style } = new FontFace(ts);

        return cssGenerator.atRule(style);
    }).join("\n\n");

    const textStyleCode = textStyles.map(t => {
        const { style } = new TextStyle(t);

        return cssGenerator.ruleSet(style);
    }).join("\n\n");

    return {
        code: `${fontFaceCode}\n\n${textStyleCode}`,
        language: LANG
    };
}

function layer(context, selectedLayer) {
    const params = getParams(context);
    const cssGenerator = createGenerator(context, params);

    const l = new Layer(selectedLayer);
    const layerRuleSet = l.style;
    const childrenRuleSet = [];
    const { defaultTextStyle } = selectedLayer;

    if (selectedLayer.type === "text" && defaultTextStyle) {
        const declarations = l.getLayerTextStyleDeclarations(defaultTextStyle);

        declarations.forEach(p => layerRuleSet.addDeclaration(p));

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

    const layerStyle = cssGenerator.ruleSet(layerRuleSet);
    const childrenStyles = childrenRuleSet.map(
        s => cssGenerator.ruleSet(s, { parentDeclarations: layerRuleSet.declarations })
    );

    return {
        code: [layerStyle, ...childrenStyles].join("\n\n"),
        language: LANG
    };
}

function comment(context, text) {
    return `/* ${text} */`;
}

function exportColors(context) {
    const { code: colorCode, language } = colors(context);
    const code = `${comment(context, COPYRIGHT)}\n\n${colorCode}`;

    return {
        code,
        filename: "colors.css",
        language
    };
}

function exportTextStyles(context) {
    const { code: textStyleCode, language } = textStyles(context);
    const code = `${comment(context, COPYRIGHT)}\n\n${textStyleCode}`;

    return {
        code,
        filename: "fonts.css",
        language
    };
}

function styleguideColors(context, colorsInProject) {
    const params = getParams(context);
    const cssGenerator = createGenerator(context, params);
    const code = `:root {\n${colorsInProject.map(c => `  ${cssGenerator.variable(c.name, new Color(c))}`).join("\n")}\n}`;

    return {
        code,
        language: LANG
    };
}

function styleguideTextStyles(context, textStyles) {
    const params = getParams(context);
    const cssGenerator = createGenerator(context, params);
    const fontFaces = getFontFaces(textStyles);

    const fontFaceCode = fontFaces.map(ts => {
        const { style } = new FontFace(ts);

        return cssGenerator.atRule(style);
    }).join("\n\n");

    const textStyleCode = textStylesInProject.map(t => {
        const { style } = new TextStyle(t);

        return cssGenerator.ruleSet(style);
    }).join("\n\n"),

    return {
        code: `${fontFaceCode}\n\n${textStyleCode}`,
        language: LANG
    };
}

function exportStyleguideColors(context, colorsInProject) {
    const { code: colorCode, language } = styleguideColors(context, colorsInProject);
    const code = `${comment(context, COPYRIGHT)}\n\n${colorCode}`;

    return {
        code,
        filename: "colors.css",
        language
    };
}

function exportStyleguideTextStyles(context, textStylesInProject) {
    const { code: textStyleCode, language } = styleguideTextStyles(context, textStylesInProject);
    const code = `${comment(context, COPYRIGHT)}\n\n${textStyleCode}`;

    return {
        code,
        filename: "fonts.css",
        language
    };
}

export default {
    colors,
    textStyles,
    layer,
    comment,
    exportColors,
    exportTextStyles,
    styleguideColors,
    styleguideTextStyles,
    exportStyleguideColors,
    exportStyleguideTextStyles
};
