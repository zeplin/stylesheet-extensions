import {
    ContextParams,
    ExtensionMethodCreator,
    ExtensionMethodCreatorParams,
    ExtensionMethodOptions,
    ExtensionMethodReturnType,
    getParams,
    getResourceContainer,
    getResources,
    getUniqueLayerTextStyles,
    isHtmlTag,
    Layer,
    Mixin,
    RuleSet,
    selectorize
} from "zeplin-extension-style-kit";
import {
    Context,
    Layer as ExtensionLayer,
    Project,
    Styleguide,
    TextStyle as ExtensionTextStyle
} from "@zeplin/extension-model";

export type LayerExtensionMethodOptions = ExtensionMethodOptions & {
    layerPrefix?: string | ((l: ExtensionLayer) => string);
    layerSuffix?: string | ((l: ExtensionLayer) => string);
};

export type LayerCodeGeneratorParams = ExtensionMethodCreatorParams & {
    options?: LayerExtensionMethodOptions
}

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

type MethodName = "layer";

export const createLayerExtensionMethod: ExtensionMethodCreator<MethodName> = (generatorParams: LayerCodeGeneratorParams) =>
    (context: Context, selectedLayer: ExtensionLayer): ExtensionMethodReturnType<MethodName> => {
        const {
            Generator,
            options: {
                language,
                blockCodeOptions: {
                    separator = "\n"
                } = {},
                declarationOptions,
                layerPrefix = "",
                layerSuffix = ""
            } = {},
        } = generatorParams;

        const params = getParams(context);
        const generator = new Generator(context, params, declarationOptions);

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

        const prefix = typeof layerPrefix === "function" ? layerPrefix(selectedLayer) : layerPrefix;
        const suffix = typeof layerSuffix === "function" ? layerSuffix(selectedLayer) : layerSuffix;

        return {
            code: `${prefix}${[layerStyle, ...childrenStyles].join(separator)}${suffix}`,
            language: language!
        };
    };
