import { STYLE_PROPS } from "../constants";

class TextAlign {
    constructor(value) {
        this.value = value;
    }

    get name() {
        return STYLE_PROPS.TEXT_ALIGN;
    }

    equals(other) {
        return this.value === other.value;
    }

    getValue() {
        return this.value;
    }
}

export default TextAlign;