import Layer from "zeplin-extension-style-kit/elements/layer";
import RuleSet from "zeplin-extension-style-kit/ruleSet";
import Mixin from "zeplin-extension-style-kit/declarations/mixin";
import {
    getResources,
    getUniqueLayerTextStyles,
    selectorize,
    isHtmlTag,
    getParams,
    getResourceContainer
} from "zeplin-extension-style-kit/utils";

function findBestConformTextStyle(searchedTextStyle, context, params) {
    const { container } = getResourceContainer(context);
    if (container.findBestConformingTextStyle) {
        return container.findBestConformingTextStyle(searchedTextStyle, params.useLinkedStyleguides);
    }

    // Fallback for backwards compatibility
    const textStyles = getResources({
        context,
        useLinkedStyleguides: params.useLinkedStyleguides,
        key: "textStyles"
    });
    let result = { textStyle: null, score: 0 };
    for (const textStyle of textStyles) {
        if (textStyle.sourceId && searchedTextStyle.sourceId && textStyle.sourceId === searchedTextStyle.sourceId) {
            return textStyle;
        }

        const newScore = Object.values(textStyle).filter(value => value !== void 0).length;
        if (searchedTextStyle.conforms(textStyle) && newScore > result.score) {
            result = {
                score: newScore,
                textStyle
            };
        }
    }
    return result.textStyle;
}

function getTextStyleDeclarations(textStyle, layer, context, params) {
    const matchedTextStyle = findBestConformTextStyle(textStyle, context, params);
    const declarations = layer.getLayerTextStyleDeclarations(textStyle);

    const textStyleName = matchedTextStyle && matchedTextStyle.name;

    if (params.useMixin && textStyleName && !isHtmlTag(selectorize(textStyleName))) {
        declarations.push(new Mixin(selectorize(textStyleName).replace(/^\./, "")));
        const mixinRuleSet = new RuleSet("mixin", layer.getLayerTextStyleDeclarations(matchedTextStyle));
        return declarations.filter(declaration => !mixinRuleSet.hasProperty(declaration.name));
    }

    return declarations;
}

export const layerCodeGenerator = ({
    language,
    Generator,
    options: {
        separator = "\n\n"
    } = {}
}) => (context, selectedLayer) => {
    const params = getParams(context);
    const { container } = getResourceContainer(context);
    const generator = new Generator(container, params);

    const l = new Layer(selectedLayer, params);
    const layerRuleSet = l.style;
    const childrenRuleSet = [];
    const { defaultTextStyle } = selectedLayer;

    if (selectedLayer.type === "text" && defaultTextStyle) {
        const declarations = getTextStyleDeclarations(defaultTextStyle, l, context, params);
        declarations.forEach(d => layerRuleSet.addDeclaration(d));
        let nameCount = 0;

        getUniqueLayerTextStyles(selectedLayer).filter(
            textStyle => !defaultTextStyle.equals(textStyle)
        ).forEach(textStyle => {
            const font = findBestConformTextStyle(textStyle, context, params);
            const name = font ? font.name : `text-style-${++nameCount}`;

            childrenRuleSet.push(
                new RuleSet(
                    `${selectorize(selectedLayer.name)} ${selectorize(name)}`,
                    getTextStyleDeclarations(textStyle, l, context, params)
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
