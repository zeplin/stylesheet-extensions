import Layer from "zeplin-extension-style-kit/elements/layer";
import TextStyle from "zeplin-extension-style-kit/elements/textStyle";
import Color from "zeplin-extension-style-kit/values/color";
import Mixin from "zeplin-extension-style-kit/declarations/mixin";
import RuleSet from "zeplin-extension-style-kit/ruleSet";
import { isHtmlTag, getUniqueLayerTextStyles, selectorize } from "zeplin-extension-style-kit/utils";

import StylusGenerator from "./generator";
import { COPYRIGHT, LANG, OPTION_NAMES } from "./constants";

function getVariableMap(projectColors, params) {
    const variables = {};

    projectColors.forEach(projectColor => {
        variables[new Color(projectColor).valueOf()] = projectColor.name;
    });

    return variables;
}

function createGenerator(project, params) {
    return new StylusGenerator(getVariableMap(project.colors, params), params);
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
    const stylusGenerator = createGenerator(context.project, params);

    return {
        code: colors.map(c => stylusGenerator.variable(c.name, new Color(c))).join("\n"),
        language: LANG
    };
}

function styleguideTextStyles(context, textStyles) {
    const params = getParams(context);
    const stylusGenerator = createGenerator(context.project, params);

    return {
        code: textStyles.map(t => {
            const { style } = new TextStyle(t);

            return stylusGenerator.ruleSet(style, { mixin: params.useMixin });
        }).join("\n\n"),
        language: LANG
    };
}

function layer(context, selectedLayer) {
    const params = getParams(context);
    const { useMixin } = params;
    const stylusGenerator = createGenerator(context.project, params);

    const l = new Layer(selectedLayer);
    const layerRuleSet = l.style;
    const childrenRuleSet = [];
    const { defaultTextStyle } = selectedLayer;

    if (selectedLayer.type === "text" && defaultTextStyle) {
        const projectTextStyle = context.project.findTextStyleEqual(defaultTextStyle);
        const declarations = l.getLayerTextStyleDeclarations(defaultTextStyle);
        let textStyleName;

        if (projectTextStyle) {
            textStyleName = projectTextStyle.name;
        }

        if (useMixin && textStyleName && !isHtmlTag(selectorize(textStyleName))) {
            const mixinRuleSet = new RuleSet("mixin", l.getLayerTextStyleDeclarations(projectTextStyle));

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

    const layerStyle = stylusGenerator.ruleSet(layerRuleSet);
    const childrenStyles = childrenRuleSet.map(
        s => stylusGenerator.ruleSet(s, { parentDeclarations: layerRuleSet.declarations })
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
        filename: "colors.stylus",
        language
    };
}

function exportStyleguideTextStyles(context, textStyles) {
    const { code: textStyleCode, language } = styleguideTextStyles(context, textStyles);
    const code = `${comment(context, COPYRIGHT)}\n\n${textStyleCode}`;

    return {
        code,
        filename: "fonts.stylus",
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