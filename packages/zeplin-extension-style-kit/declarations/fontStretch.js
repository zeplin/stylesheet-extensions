import { STYLE_PROPS } from "../constants";

const STRETCH_KEYWORD = Object.freeze({
    "ultra-condensed": 50,
    "extra-condensed": 62.5,
    "condensed": 75,
    "semi-condensed": 87.5,
    "normal": 100,
    "semi-expanded": 112.5,
    "expanded": 125,
    "extra-expanded": 150,
    "ultra-expanded": 200
});

class FontStretch {
    constructor(value = FontStretch.DEFAULT_VALUE) {
        if (typeof value === "string") {
            this.value = STRETCH_KEYWORD[value];
        } else {
            this.value = value;
        }
    }

    static get DEFAULT_VALUE() {
        return STRETCH_KEYWORD.normal;
    }

    get name() {
        return STYLE_PROPS.FONT_STRETCH;
    }

    equals(other) {
        return this.value === other.value;
    }

    hasDefaultValue() {
        return this.value === FontStretch.DEFAULT_VALUE;
    }

    getValue() {
        const value = Object.entries(STRETCH_KEYWORD)
            .find(([, val]) => this.value === val);

        return value ? value[0] : `${this.value}%`;
    }
}

export default FontStretch;
