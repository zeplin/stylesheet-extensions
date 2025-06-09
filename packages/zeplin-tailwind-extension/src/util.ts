import { Barrel } from "@zeplin/extension-model";

export function getMinimumSpacingValue(container: Barrel): number {
    const minimumSpacingToken = container.spacingSections
        .filter((item, index, self) => index === self.findIndex(other => item.name === other.name))
        .map(({ spacingTokens: items }) => items)
        .reduce((prev, current) => [...prev, ...current], [])
        .reduce((p, c) => {
            if (c.value < p.value) {
                return c;
            }
            return p;
        }, { value : 0 });

    return minimumSpacingToken.value;
}