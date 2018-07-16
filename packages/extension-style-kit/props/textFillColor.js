import { STYLE_PROPS } from "../constants";

class TextFillColor {
    constructor(value) {
        this.value = value;
    }

    get name() {
        return STYLE_PROPS.TEXT_FILL_COLOR;
    }

    equals(other) {
        return this.value === other.value;
    }

    getValue() {
        return this.value;
    }
}

export default TextFillColor;