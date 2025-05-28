import { STYLE_PROPS } from "../constants";
import { StyleDeclaration } from "../common";

export type StretchKeyword =
    | "ultra-condensed"
    | "extra-condensed"
    | "condensed"
    | "semi-condensed"
    | "normal"
    | "semi-expanded"
    | "expanded"
    | "extra-expanded"
    | "ultra-expanded";

interface StretchKeywords {
    [key: string]: number;
}

const STRETCH_KEYWORD: StretchKeywords = {
    "ultra-condensed": 50,
    "extra-condensed": 62.5,
    "condensed": 75,
    "semi-condensed": 87.5,
    "normal": 100,
    "semi-expanded": 112.5,
    "expanded": 125,
    "extra-expanded": 150,
    "ultra-expanded": 200
} as const;

export class FontStretch implements StyleDeclaration {
    private value: number;

    constructor(value: StretchKeyword | number = FontStretch.DEFAULT_VALUE) {
        if (typeof value === "string") {
            this.value = STRETCH_KEYWORD[value];
        } else {
            this.value = value;
        }
    }

    static get DEFAULT_VALUE(): number {
        return STRETCH_KEYWORD.normal;
    }

    get name(): string {
        return STYLE_PROPS.FONT_STRETCH;
    }

    equals(other: FontStretch): boolean {
        return this.value === other.value;
    }

    hasDefaultValue() {
        return this.value === FontStretch.DEFAULT_VALUE;
    }

    getValue(): string {
        const keyword = Object.entries(STRETCH_KEYWORD).find(([, v]) => v === this.value);
        return keyword ? keyword[0] : `${this.value}%`;
    }
}
