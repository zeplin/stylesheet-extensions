import { SpacingSection } from "@zeplin/extension-model";

const TAILWIND_DEFAULT_SPACING_VALUE = 4;

export function getMinimumSpacingValue(spacingSections: SpacingSection[]): number {
    const spacingTokens = spacingSections
        .map(({ spacingTokens: items }) => items)
        .reduce((prev, current) => [...prev, ...current], []);

    if (spacingTokens.length === 0) {
        return TAILWIND_DEFAULT_SPACING_VALUE;
    } else {
        return spacingTokens.reduce((p, c) => {
            if (c.value < p.value) {
                return c;
            }
            return p;
        }).value;
    }
}
