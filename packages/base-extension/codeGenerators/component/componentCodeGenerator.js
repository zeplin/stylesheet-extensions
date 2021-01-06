import { selectorize } from "zeplin-extension-style-kit/utils";
import { LayerStyleMap } from "./layerStyleMap";
import { generateCodeForLayers, groupComponentLayersBySignature, getCommonRuleset } from "./layerUtils";
import {
    findDefaultStateComponent,
    getPropertyFiltersForComponent,
    filterComponentsByProperties,
    selectorizeComponentProperty,
    getDefaultPropertyFilters
} from "./componentUtils";

export class ComponentCodeGenerator {
    constructor(generator, options) {
        this.generator = generator;
        this.language = options.language;
        this.lineSeparator = options.lineSeparator;
    }

    generateSelectiveSubsets(array, proper = false) {
        const { length } = array;

        if (length === 0) {
            return [];
        }

        const subsets = [[]];

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

    getClassNamesForPropertyFilters(propertyFilters) {
        return propertyFilters.map(
            pf => selectorizeComponentProperty({ value: pf.targetValue, name: pf.propertyName })
        ).filter(Boolean);
    }

    generateCommonStylesForComponents(components) {
        const commonLayerGroups = groupComponentLayersBySignature(components.map(c => c.latestVersion));
        const commonStyles = {};

        for (const { signature, layers } of commonLayerGroups) {
            const style = getCommonRuleset(layers);

            if (style) {
                commonStyles[signature] = style;
            }
        }

        return commonStyles;
    }

    getPropertyFilterCombinations(component) {
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

    collectCommonStyles(component) {
        const { variant } = component;
        const styleMap = new LayerStyleMap(array => this.generateSelectiveSubsets(array, true));
        const commonBlocksMap = new Map();

        if (!variant) {
            return;
        }

        for (const filterCombination of this.getPropertyFilterCombinations(component)) {
            const filteredComponents = filterComponentsByProperties(variant.components, filterCombination);

            if (filteredComponents.length > 0) {
                const styles = this.generateCommonStylesForComponents(filteredComponents);
                const classNames = this.getClassNamesForPropertyFilters(filterCombination);

                styleMap.addStyles(classNames, styles);
                commonBlocksMap.set(classNames.join(""), classNames);
            }
        }

        return {
            commonBlocks: commonBlocksMap.values(),
            styleMap
        };
    }

    generateCodeForVariantComponent(component) {
        const globalClassName = selectorize(component.variant.name);
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

    generateCodeForSingleComponent(component) {
        const globalClassName = selectorize(component.name);
        const classNames = [globalClassName];

        if (component.variant) {
            const propertyFilters = getPropertyFiltersForComponent(component);

            classNames.push(...this.getClassNamesForPropertyFilters(propertyFilters));
        }

        return generateCodeForLayers(this.generator, component.latestVersion.layers, classNames, this.styleMap);
    }

    generate(component) {
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
