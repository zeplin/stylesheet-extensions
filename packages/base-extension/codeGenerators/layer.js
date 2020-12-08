import Layer from "zeplin-extension-style-kit/elements/layer";
import RuleSet from "zeplin-extension-style-kit/ruleSet";
import Mixin from "zeplin-extension-style-kit/declarations/mixin";
import {
    getResources,
    getUniqueLayerTextStyles,
    selectorize,
    isHtmlTag,
    getParams,
    generateIdentifier,
    getUniqueFirstItems
} from "zeplin-extension-style-kit/utils";

export const layerCodeGenerator = ({
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
        const textStyles = getUniqueFirstItems(getResources({
            context,
            useLinkedStyleguides: params.useLinkedStyleguides,
            key: "textStyles"
        }), (textStyle, other) => generateIdentifier(textStyle.name) === generateIdentifier(other.name));
        const containerTextStyle = textStyles.find(textStyle => (
            defaultTextStyle.conforms ? defaultTextStyle.conforms(textStyle) : defaultTextStyle.equals(textStyle)
        ));

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