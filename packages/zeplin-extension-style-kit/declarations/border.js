import { STYLE_PROPS } from "../constants";

class Border {
    constructor({ style, width, color }) {
        this.style = style;
        this.width = width;
        this.color = color;
    }

    get name() {
        return STYLE_PROPS.BORDER;
    }

    equals(other) {
        const { style, width, color } = this;

        return other.style === style && other.width.equals(width) && other.color.equals(color);
    }

    getValue(params, getColorName) {
        const { style, width, color } = this;

        return `${style} ${width.toStyleValue(params)} ${color.toStyleValue(params, getColorName)}`;
    }
}

export default Border;
