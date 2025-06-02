import { Component } from "@zeplin/extension-model";
import { Generator, RuleSet, selectorize } from "zeplin-extension-style-kit";
import { LayerStyleMap } from "./layerStyleMap.js";
import { generateCodeForLayers, getCommonRuleset, groupComponentLayersBySignature } from "./layerUtils.js";
import {
    filterComponentsByProperties,
    findDefaultStateComponent,
    getDefaultPropertyFilters,
    getPropertyFiltersForComponent,
    PropertyFilter,
    selectorizeComponentProperty
} from "./componentUtils.js";

export type ComponentCodeGeneratorOptions = {
    generator: Generator;
    language: string,
    lineSeparator: string
};

export class ComponentCodeGenerator {
    private readonly generator: Generator;
    private readonly language: string;
    private readonly lineSeparator: string;
    private readonly styleMap: LayerStyleMap;

    constructor(options: ComponentCodeGeneratorOptions) {
        this.generator = options.generator;
        this.language = options.language;
        this.lineSeparator = options.lineSeparator;
        this.styleMap = new LayerStyleMap(array => this.generateSelectiveSubsets(array, true));
    }

    generateSelectiveSubsets<T>(array: T[], proper = false): T[][] {
        const { length } = array;

        if (length === 0) {
            return [];
        }

        const subsets: T[][] = [[]];

        if (length === 1 && proper) {
            return subsets;
        }

        subsets.push(...array.map(elem => [elem]));

        const limit = proper ? length - 1 : length;
        for (let i = 2; i <= limit; i++) {
            subsets.push(array.slice(0, i));
        }

        return subsets;
    }

    getClassNamesForPropertyFilters(propertyFilters: PropertyFilter[]): string[] {
        return propertyFilters.map(
            pf => selectorizeComponentProperty({ value: pf.targetValue, name: pf.propertyName })
        ).filter(Boolean);
    }

    generateCommonStylesForComponents(components: Component[]): Record<string, RuleSet> {
        const commonLayerGroups = groupComponentLayersBySignature(components.map(c => c.latestVersion!));
        const commonStyles: Record<string, RuleSet> = {};

        for (const { signature, layers } of commonLayerGroups) {
            const style = getCommonRuleset(layers);

            if (style) {
                commonStyles[signature] = style;
            }
        }

        return commonStyles;
    }

    getPropertyFilterCombinations(component: Component) {
        const filterCombinations = [];
        const propertyFilters = getPropertyFiltersForComponent(component);
        const defaultPropertyFilters = getDefaultPropertyFilters(component);

        filterCombinations.push(...this.generateSelectiveSubsets(propertyFilters));
        filterCombinations.push(...this.generateSelectiveSubsets(defaultPropertyFilters));

        const defaultStateComponent = findDefaultStateComponent(component);
        if (defaultStateComponent) {
            filterCombinations.push(getPropertyFiltersForComponent(defaultStateComponent));
        }

        return filterCombinations;
    }

    collectCommonStyles(component: Component): {
        commonBlocks: IterableIterator<string[]>,
        styleMap: LayerStyleMap
    } {
        const { variant } = component;
        const commonBlocksMap = new Map();

        if (variant) {
            for (const filterCombination of this.getPropertyFilterCombinations(component)) {
                const filteredComponents = filterComponentsByProperties(variant.components, filterCombination);

                if (filteredComponents.length > 0) {
                    const styles = this.generateCommonStylesForComponents(filteredComponents);
                    const classNames = this.getClassNamesForPropertyFilters(filterCombination);

                    this.styleMap.addStyles(classNames, styles);
                    commonBlocksMap.set(classNames.join(""), classNames);
                }
            }
        }

        return {
            commonBlocks: commonBlocksMap.values(),
            styleMap: this.styleMap
        };
    }

    generateCodeForVariantComponent(component: Component) {
        const globalClassName = selectorize(component.variant!.name);
        const { commonBlocks, styleMap } = this.collectCommonStyles(component);
        const codeBlocks = [];

        for (const classNames of commonBlocks) {
            const layerStyles = styleMap.getStyles(classNames);

            for (const [signature, ruleSet] of Object.entries(layerStyles)) {
                const codeBlock = this.generator.ruleSet(ruleSet, {
                    parentDeclarations: styleMap.getParentDeclarations(classNames, signature),
                    scope: [globalClassName].concat(classNames).join("")
                });

                if (codeBlock) {
                    codeBlocks.push(codeBlock);
                }
            }
        }

        return codeBlocks;
    }

    generateCodeForSingleComponent(component: Component) {
        const globalClassName = selectorize(component.name);
        const classNames = [globalClassName];

        if (component.variant) {
            const propertyFilters = getPropertyFiltersForComponent(component);

            classNames.push(...this.getClassNamesForPropertyFilters(propertyFilters));
        }

        return generateCodeForLayers(this.generator, component.latestVersion?.layers || [], classNames, this.styleMap);
    }

    generate(component: Component) {
        let codeBlocks;

        if (component.variant) {
            codeBlocks = this.generateCodeForVariantComponent(component);
        } else {
            codeBlocks = this.generateCodeForSingleComponent(component);
        }

        return {
            code: codeBlocks.join(this.lineSeparator),
            language: this.language
        };
    }
}
