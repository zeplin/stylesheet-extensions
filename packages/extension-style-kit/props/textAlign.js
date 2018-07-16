import { STYLE_PROPS } from "../constants";

class TextAlign {
    constructor(value) {
        this.value = value;
    }

    static get DEFAULT_VALUE() {
        return "normal";
    }

    get name() {
        return STYLE_PROPS.TEXT_ALIGN;
    }

    hasDefaultValue() {
        return this.value === TextAlign.DEFAULT_VALUE;
    }

    equals(other) {
        return this.value === other.value;
    }

    getValue() {
        return this.value;
    }
}

export default TextAlign;