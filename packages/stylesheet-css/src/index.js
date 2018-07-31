import Layer from "extension-style-kit/elements/layer";
import TextStyle from "extension-style-kit/elements/textStyle";
import Color from "extension-style-kit/values/color";
import RuleSet from "extension-style-kit/ruleSet";
import { getUniqueLayerTextStyles, selectorize } from "extension-style-kit/utils";

import CssGenerator from "./generator";
import { LANG, OPTION_NAMES } from "./constants";

function getVariableMap(projectColors, params) {
    const variables = {};

    projectColors.forEach(projectColor => {
        variables[new Color(projectColor).toStyleValue(params)] = projectColor.name;
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

    return {
        code: colors.map(c => cssGenerator.variable(c.name, new Color(c))).join("\n"),
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
        }).join("\n"),
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
        const textStyleProps = l.getLayerTextStyleProps(defaultTextStyle);

        textStyleProps.forEach(p => layerRuleSet.addProp(p));

        getUniqueLayerTextStyles(selectedLayer).filter(
            textStyle => !defaultTextStyle.equals(textStyle)
        ).forEach((textStyle, idx) => {
            childrenRuleSet.push(
                new RuleSet(
                    `${selectorize(selectedLayer.name)} ${selectorize(`text-style-${idx + 1}`)}`,
                    l.getLayerTextStyleProps(textStyle)
                )
            );
        });
    }

    const layerStyle = cssGenerator.ruleSet(layerRuleSet);
    const childrenStyles = childrenRuleSet.map(s => cssGenerator.ruleSet(s, { parentProps: layerRuleSet.props }));

    return {
        code: [layerStyle, ...childrenStyles].join("\n\n"),
        language: LANG
    };
}

export default {
    styleguideColors,
    styleguideTextStyles,
    layer
};