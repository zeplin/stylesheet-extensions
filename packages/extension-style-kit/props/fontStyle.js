import { STYLE_PROPS } from "../constants";

class FontStyle {
    constructor(value) {
        this.value = value;
    }

    static get DEFAULT_VALUE() {
        return "normal";
    }

    get name() {
        return STYLE_PROPS.FONT_STYLE;
    }

    equals(other) {
        return this.value === other.value;
    }

    hasDefaultValue() {
        return this.value === FontStyle.DEFAULT_VALUE;
    }

    getValue() {
        if (this.hasDefaultValue()) {
            return FontStyle.DEFAULT_VALUE;
        }

        return this.value;
    }
}

export default FontStyle;