import Layer from "@root/elements/layer";
import TextStyle from "@root/elements/textStyle";
import Color from "@root/values/color";
import RuleSet from "@root/ruleSet";
import { getUniqueLayerTextStyles, selectorize } from "@root/utils";

import Generator from "./generator";

/*

function getVariableMap(projectColors, params) {
    const variables = {};

    projectColors.forEach(projectColor => {
        variables[new Color(projectColor).toStyleValue(params)] = projectColor.name;
    });

    return variables;
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

*/

class Extension {
    constructor(params, variables = {}) {
        this.params = params;
        this.variables = variables;

        this.generator = new Generator(this.variables, this.params);
    }

    styleguideColors(colors) {
        return colors.map(c => this.generator.variable(c.name, new Color(c))).join("\n");
    }

    styleguideTextStyles(textStyles) {
        return textStyles.map(t => {
            const { style } = new TextStyle(t);

            return this.generator.ruleSet(style);
        }).join("\n");
    }

    layer(selectedLayer) {
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

        const layerStyle = this.generator.ruleSet(layerRuleSet);
        const childrenStyles = childrenRuleSet.map(
            s => this.generator.ruleSet(s, { parentDeclarations: layerRuleSet.declarations })
        );

        return [layerStyle, ...childrenStyles].join("\n\n");
    }
}

export default Extension;