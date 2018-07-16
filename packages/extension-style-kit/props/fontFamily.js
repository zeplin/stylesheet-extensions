import { STYLE_PROPS } from "../constants";

class FontFamily {
    constructor(value) {
        this.value = value;
    }

    static get DEFAULT_VALUE() {
        return "normal";
    }

    get name() {
        return STYLE_PROPS.FONT_FAMILY;
    }

    hasDefaultValue() {
        return this.value === FontFamily.DEFAULT_VALUE;
    }

    equals(other) {
        return this.value === other.value;
    }

    getValue() {
        return this.value;
    }
}

export default FontFamily;