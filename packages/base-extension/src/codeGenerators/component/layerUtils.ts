import { Generator, Layer, RuleSet } from "zeplin-extension-style-kit";
import { Layer as ExtensionLayer, Version } from "@zeplin/extension-model";
import { LayerStyleMap } from "./layerStyleMap.js";

function getLayerSignature(layer: ExtensionLayer): string {
    return `${layer.rect.width}:${layer.rect.height}:${layer.rect.x}:${layer.rect.y}:${layer.name}:${layer.type}:${layer.content}`;
}

function generateLayerStyle(layer: ExtensionLayer): RuleSet {
    const layerElement = new Layer(layer);
    const ruleSet = layerElement.style;

    if (layer.defaultTextStyle) {
        const textStyles = layerElement.getLayerTextStyleDeclarations(layer.defaultTextStyle);

        for (const declaration of textStyles) {
            ruleSet.addDeclaration(declaration);
        }
    }

    return ruleSet;
}

function flatLayers(layers: ExtensionLayer[] = []): ExtensionLayer[] {
    return layers.flatMap(layer => (layer.exportable ? [layer] : [layer].concat(flatLayers(layer.layers))));
}

function groupComponentLayersBySignature(componentVersions: Version[] = []): { signature: string, layers: ExtensionLayer[] }[] {
    const [pivotLayers, ...otherVersions] = componentVersions.map(({ layers }) => flatLayers(layers));

    return pivotLayers.map(layer => {
        const matchingLayers = [layer];

        for (const otherLayers of otherVersions) {
            const matchingLayer = otherLayers.find(
                other => getLayerSignature(layer) === getLayerSignature(other)
            );

            if (!matchingLayer) {
                break;
            }

            matchingLayers.push(matchingLayer);
        }

        return {
            signature: getLayerSignature(layer),
            layers: matchingLayers
        };
    }).filter(group => group.layers.length === componentVersions.length);
}

function getCommonRuleset(layers: ExtensionLayer[] = []): RuleSet | undefined {
    const layerStyles = layers.filter(l => l.inspectable).map(l => generateLayerStyle(l));
    const [pivot, ...rest] = layerStyles;

    if (!pivot) {
        return;
    }

    const commonDeclarations = pivot.declarations.filter(decl => (
        rest.every(layerStyle => layerStyle.declarations.find(otherDecl => (
            decl.name === otherDecl.name && otherDecl.equals(decl)
        )))
    ));

    return new RuleSet(pivot.selector, commonDeclarations);
}

function generateCodeForLayers(generator: Generator, layers: ExtensionLayer[], classNames: string[], layerStyleMap: LayerStyleMap | undefined): string[] {
    return layers.filter(layer => layer.inspectable).flatMap(layer => {
        const ruleSet = generateLayerStyle(layer);
        const layerSignature = getLayerSignature(layer);
        const codeBlock = generator.ruleSet(ruleSet, {
            parentDeclarations: layerStyleMap && layerStyleMap.getParentDeclarations(classNames, layerSignature),
            scope: classNames.join("")
        });

        if (layer.exportable) {
            return codeBlock;
        }

        return [
            codeBlock,
            ...generateCodeForLayers(
                generator,
                (layer.layers || []),
                classNames,
                layerStyleMap
            )
        ];
    }).filter(Boolean);
}

export {
    generateCodeForLayers,
    groupComponentLayersBySignature,
    getCommonRuleset
};