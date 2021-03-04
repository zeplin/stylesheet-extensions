import { STYLE_PROPS } from "../constants";

class TextStroke {
    constructor(length, color) {
        this.length = length;
        this.color = color;
    }

    get name() {
        return STYLE_PROPS.TEXT_STROKE;
    }

    equals(other) {
        return this.length.equals(other.length) && this.color.equals(other.color);
    }

    getValue(params, colorNameResolver) {
        const { color, length } = this;

        return `${length.toStyleValue(params)} ${color.toStyleValue(params, colorNameResolver)}`;
    }
}

export default TextStroke;
