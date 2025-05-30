import { RuleSet } from "zeplin-extension-style-kit";

export type SubsetGenerator = (list: string[]) => string[][];

export class LayerStyleMap {
    private readonly subsetGenerator: SubsetGenerator;
    private readonly styleMap: Map<string, Record<string, RuleSet>>;

    constructor(subsetGenerator: SubsetGenerator) {
        this.subsetGenerator = subsetGenerator;
        this.styleMap = new Map();
    }

    getKey(classNames: string[]): string {
        return [...classNames].sort().join(":");
    }

    mergeRuleSets(first: RuleSet, second: RuleSet): RuleSet {
        return new RuleSet(
            first.selector,
            [...first.declarations].concat(second.declarations)
        );
    }

    mergeLayerStyles(layerStyleMap: Record<string, RuleSet>, other: Record<string, RuleSet>): Record<string, RuleSet> {
        const merged = Object.assign({}, layerStyleMap);

        for (const [signature, otherRuleSet] of Object.entries(other)) {
            const ruleSet = merged[signature];

            merged[signature] = ruleSet ? this.mergeRuleSets(ruleSet, otherRuleSet) : otherRuleSet;
        }

        return merged;
    }

    addStyles(classNames: string[], layerStyles: Record<string, RuleSet>) {
        const key = this.getKey(classNames);

        let styles = this.styleMap.get(key);

        if (styles) {
            styles = this.mergeLayerStyles(styles, layerStyles);
        } else {
            styles = layerStyles;
        }

        this.styleMap.set(key, styles);
    }

    getStyles(classNames: string[]): Record<string, RuleSet> {
        const key = this.getKey(classNames);
        return this.styleMap.get(key) || {};
    }

    getParentDeclarations(classNames: string[], signature: string) {
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