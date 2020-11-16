import RuleSet from "zeplin-extension-style-kit/ruleSet";

export class LayerStyleMap {
    constructor(subsetGenerator) {
        this.subsetGenerator = subsetGenerator;
        this.styleMap = new Map();
    }

    getKey(classNames) {
        return [...classNames].sort().join(":");
    }

    mergeRuleSets(first, second) {
        return new RuleSet(
            first.selector,
            [...first.declarations].concat(second.declarations)
        );
    }

    mergeLayerStyles(layerStyleMap, other) {
        const merged = Object.assign({}, layerStyleMap);

        for (const [signature, otherRuleSet] of Object.entries(other)) {
            const ruleSet = merged[signature];

            merged[signature] = ruleSet ? this.mergeRuleSets(ruleSet, otherRuleSet) : otherRuleSet;
        }

        return merged;
    }

    addStyles(classNames, layerStyles) {
        const key = this.getKey(classNames);

        let styles = this.styleMap.get(key);

        if (styles) {
            styles = this.mergeLayerStyles(styles, layerStyles);
        } else {
            styles = layerStyles;
        }

        this.styleMap.set(key, styles);
    }

    getStyles(classNames) {
        const key = this.getKey(classNames);
        return this.styleMap.get(key) || {};
    }

    getParentDeclarations(classNames, signature) {
        const classNameCombinations = this.subsetGenerator(classNames);
        let mergedRuleSet;

        for (const comb of classNameCombinations) {
            const styles = this.getStyles(comb);
            const layerStyles = styles && styles[signature];

            if (layerStyles) {
                mergedRuleSet = mergedRuleSet ? this.mergeRuleSets(mergedRuleSet, layerStyles) : layerStyles;
            }
        }

        return mergedRuleSet ? mergedRuleSet.declarations : [];
    }
}