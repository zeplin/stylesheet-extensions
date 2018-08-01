import Layer from "zeplin-extension-style-kit/elements/layer";
import TextStyle from "zeplin-extension-style-kit/elements/textStyle";
import Color from "zeplin-extension-style-kit/values/color";
import Mixin from "zeplin-extension-style-kit/props/mixin";
import RuleSet from "zeplin-extension-style-kit/ruleSet";
import { isHtmlTag, getUniqueLayerTextStyles, selectorize } from "zeplin-extension-style-kit/utils";

import SassGenerator from "./generator";
import { COPYRIGHT, LANG, OPTION_NAMES } from "./constants";

function getVariableMap(projectColors, params) {
    const variables = {};

    projectColors.forEach(projectColor => {
        variables[new Color(projectColor).toStyleValue(params)] = projectColor.name;
    });

    return variables;
}

function createGenerator(project, params) {
    return new SassGenerator(getVariableMap(project.colors, params), params);
}

function getParams(context) {
    return {
        densityDivisor: context.project.densityDivisor,
        colorFormat: context.getOption(OPTION_NAMES.COLOR_FORMAT),
        useMixin: context.getOption(OPTION_NAMES.MIXIN),
        showDimensions: context.getOption(OPTION_NAMES.SHOW_DIMENSIONS),
        showDefaultValues: context.getOption(OPTION_NAMES.SHOW_DEFAULT_VALUES),
        unitlessLineHeight: context.getOption(OPTION_NAMES.UNITLESS_LINE_HEIGHT)
    };
}

function styleguideColors(context, colors) {
    const params = getParams(context);
    const sassGenerator = createGenerator(context.project, params);

    return {
        code: colors.map(c => sassGenerator.variable(c.name, new Color(c))).join("\n"),
        language: LANG
    };
}

function styleguideTextStyles(context, textStyles) {
    const params = getParams(context);
    const sassGenerator = createGenerator(context.project, params);

    return {
        code: textStyles.map(t => {
            const { style } = new TextStyle(t);

            return sassGenerator.ruleSet(style, { mixin: params.useMixin });
        }).join("\n\n"),
        language: LANG
    };
}

function layer(context, selectedLayer) {
    const params = getParams(context);
    const { useMixin } = params;
    const sassGenerator = createGenerator(context.project, params);

    const l = new Layer(selectedLayer);
    const layerRuleSet = l.style;
    const childrenRuleSet = [];
    const { defaultTextStyle } = selectedLayer;

    if (selectedLayer.type === "text" && defaultTextStyle) {
        selectedLayer.textStyles.forEach(({ textStyle }) => {
            const projectTextStyle = context.project.findTextStyleEqual(textStyle);

            if (projectTextStyle) {
                textStyle.name = projectTextStyle.name;
            }
        });

        const { name: textStyleName } = defaultTextStyle;

        if (useMixin && textStyleName && !isHtmlTag(selectorize(textStyleName))) {
            layerRuleSet.addProp(new Mixin(selectorize(textStyleName).replace(/^\./, "")));
        } else {
            const textStyleProps = l.getLayerTextStyleProps(defaultTextStyle);

            textStyleProps.forEach(p => layerRuleSet.addProp(p));
        }

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

    const layerStyle = sassGenerator.ruleSet(layerRuleSet);
    const childrenStyles = childrenRuleSet.map(s => sassGenerator.ruleSet(s, { parentProps: layerRuleSet.props }));

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
        filename: "colors.sass",
        language
    };
}

function exportStyleguideTextStyles(context, textStyles) {
    const { code: textStyleCode, language } = styleguideTextStyles(context, textStyles);
    const code = `${comment(context, COPYRIGHT)}\n\n${textStyleCode}`;

    return {
        code,
        filename: "fonts.sass",
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