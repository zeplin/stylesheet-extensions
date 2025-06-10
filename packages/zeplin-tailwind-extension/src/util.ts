import { SpacingSection } from "@zeplin/extension-model";
import { Length, LengthParams } from "zeplin-extension-style-kit";

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

export function getValueInPixels(value: Length | string, params: LengthParams): number | null {
    const stringValue = typeof value !== "string"
        ? value.toStyleValue(params)
        : value;

    const num = parseFloat(stringValue);
    if (!isNaN(num)) {
        // If it has 'rem' suffix, convert to pixels
        if (stringValue.endsWith("rem")) {
            return num * params.remPreferences!.rootFontSize;
        }

        // Otherwise it has 'px' suffix, it's in pixels
        return num;
    }

    return null;
}