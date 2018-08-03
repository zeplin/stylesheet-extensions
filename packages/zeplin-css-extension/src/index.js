import Layer from "zeplin-extension-style-kit/elements/layer";
import TextStyle from "zeplin-extension-style-kit/elements/textStyle";
import Color from "zeplin-extension-style-kit/values/color";
import RuleSet from "zeplin-extension-style-kit/ruleSet";
import { getUniqueLayerTextStyles, selectorize } from "zeplin-extension-style-kit/utils";

import CssGenerator from "./generator";
import { COPYRIGHT, LANG, OPTION_NAMES } from "./constants";

function getVariableMap(projectColors, params) {
    const variables = {};

    projectColors.forEach(projectColor => {
        variables[new Color(projectColor).valueOf()] = projectColor.name;
    });

    return variables;
}

function createGenerator(project, params) {
    return new CssGenerator(getVariableMap(project.colors, params), params);
}

function getParams(context) {
    return {
        densityDivisor: context.project.densityDivisor,
        colorFormat: context.getOption(OPTION_NAMES.COLOR_FORMAT),
        showDimensions: context.getOption(OPTION_NAMES.SHOW_DIMENSIONS),
        showDefaultValues: context.getOption(OPTION_NAMES.SHOW_DEFAULT_VALUES),
        unitlessLineHeight: context.getOption(OPTION_NAMES.UNITLESS_LINE_HEIGHT)
    };
}

function styleguideColors(context, colors) {
    const params = getParams(context);
    const cssGenerator = createGenerator(context.project, params);
    const code = `:root {\n${colors.map(c => `  ${cssGenerator.variable(c.name, new Color(c))}`).join("\n")}\n}`;

    return {
        code,
        language: LANG
    };
}

function styleguideTextStyles(context, textStyles) {
    const params = getParams(context);
    const cssGenerator = createGenerator(context.project, params);

    return {
        code: textStyles.map(t => {
            const { style } = new TextStyle(t);

            return cssGenerator.ruleSet(style);
        }).join("\n\n"),
        language: LANG
    };
}

function layer(context, selectedLayer) {
    const params = getParams(context);
    const cssGenerator = createGenerator(context.project, params);

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

function exportStyleguideColors(context, colors) {
    const { code: colorCode, language } = styleguideColors(context, colors);
    const code = `${comment(context, COPYRIGHT)}\n\n${colorCode}`;

    return {
        code,
        filename: "colors.css",
        language
    };
}

function exportStyleguideTextStyles(context, textStyles) {
    const { code: textStyleCode, language } = styleguideTextStyles(context, textStyles);
    const code = `${comment(context, COPYRIGHT)}\n\n${textStyleCode}`;

    return {
        code,
        filename: "fonts.css",
        language
    };
}

export default {
    styleguideColors,
    styleguideTextStyles,
    layer,
    comment,
    exportStyleguideColors,
    exportStyleguideTextStyles
};