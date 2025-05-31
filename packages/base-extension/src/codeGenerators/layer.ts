import {
    CodeGenerator,
    CodeOutput,
    Layer,
    RuleSet,
    Mixin,
    getResources,
    getUniqueLayerTextStyles,
    selectorize,
    isHtmlTag,
    getParams,
    getResourceContainer, ContextParams
} from "zeplin-extension-style-kit";
import {
    Layer as ExtensionLayer,
    TextStyle as ExtensionTextStyle,
    Context,
    Project,
    Styleguide
} from "@zeplin/extension-model";

function findBestConformTextStyle(searchedTextStyle: ExtensionTextStyle, context: Context, params: ContextParams) {
    const { container, type } = getResourceContainer(context);
    const barrel = type === "styleguide" ? container as Styleguide : container as Project;
    if (barrel.findBestConformingTextStyle) {
        return barrel.findBestConformingTextStyle(searchedTextStyle, params.useLinkedStyleguides);
    }

    // Fallback for backwards compatibility
    const textStyles = getResources({
        context,
        useLinkedStyleguides: params.useLinkedStyleguides,
        resourceFn: barrel => barrel.textStyles,
    });
    let result: { textStyle: ExtensionTextStyle | null, score: number } = { textStyle: null, score: 0 };
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

function getTextStyleDeclarations(textStyle: ExtensionTextStyle, layer: Layer, context: Context, params: ContextParams) {
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

export const layerCodeGenerator: CodeGenerator = (generatorParams) =>
    (context: Context, selectedLayer: ExtensionLayer): CodeOutput => {
        const {
            language,
            Generator,
            options: {
                separator = "\n"
            } = {}
        } = generatorParams;

    const params = getParams(context);
    const { container } = getResourceContainer(context);
    const generator = new Generator(container, params);

    const l = new Layer(selectedLayer);
    const layerRuleSet = l.style;
    const childrenRuleSet: RuleSet[] = [];
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
