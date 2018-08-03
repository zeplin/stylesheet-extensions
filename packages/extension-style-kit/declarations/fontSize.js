import { STYLE_PROPS } from "../constants";

class FontSize {
    constructor(value) {
        this.value = value;
    }

    static get DEFAULT_VALUE() {
        return "normal";
    }

    get name() {
        return STYLE_PROPS.FONT_SIZE;
    }

    hasDefaultValue() {
        return this.value === FontSize.DEFAULT_VALUE;
    }

    equals(other) {
        return this.value.equals(other.value);
    }

    getValue(params, variables) {
        if (this.hasDefaultValue()) {
            return FontSize.DEFAULT_VALUE;
        }

        return this.value.toStyleValue(params, variables);
    }
}

export default FontSize;