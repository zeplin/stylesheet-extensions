import { STYLE_PROPS } from "../constants";

class FontStretch {
    constructor(value) {
        this.value = value;
    }

    static get DEFAULT_VALUE() {
        return "normal";
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
        if (this.hasDefaultValue()) {
            return FontStretch.DEFAULT_VALUE;
        }

        return this.value;
    }
}

export default FontStretch;