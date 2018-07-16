import Layer from "extension-style-kit/elements/layer";
import TextStyle from "extension-style-kit/elements/textStyle";
import Color from "extension-style-kit/values/color";

import CssGenerator from "./generator";
import { OPTION_NAMES } from "./constants";

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
    const lessGenerator = createGenerator(context.project, params);

    return {
        code: colors.map(c => lessGenerator.variable(c.name, new Color(c))).join("\n"),
        language: "json"
    };
}

function styleguideTextStyles(context, textStyles) {
    const params = getParams(context);
    const { showDefaultValues } = params;
    const lessGenerator = createGenerator(context.project, params);

    return {
        code: textStyles.map(
            t => lessGenerator.ruleSet(new TextStyle(t, { showDefaultValues }).style)
        ).join("\n"),
        language: "json"
    };
}

function layer(context, selectedLayer) {
    const params = getParams(context);
    const { showDimensions, showDefaultValues } = params;
    const lessGenerator = createGenerator(context.project, params);

    selectedLayer.textStyles.forEach(({ textStyle }) => {
        const projectTextStyle = context.project.findTextStyleEqual(textStyle);

        if (projectTextStyle) {
            textStyle.name = projectTextStyle.name;
        }
    });

    const l = new Layer(selectedLayer, { showDimensions, showDefaultValues });
    const layerStyle = lessGenerator.ruleSet(l.style);
    const childrenStyles = l.childrenStyles.map(s => lessGenerator.ruleSet(s));

    return {
        code: [layerStyle, ...childrenStyles].join("\n\n"),
        language: "json"
    };
}

export default {
    styleguideColors,
    styleguideTextStyles,
    layer
};