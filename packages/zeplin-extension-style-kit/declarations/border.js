import { STYLE_PROPS } from "../constants";

class Border {
    constructor({ style, width, color, side }) {
        this.style = style;
        this.width = width;
        this.color = color;
        this.side = side;
    }

    get name() {
        if (this.side === "top") {
            return STYLE_PROPS.BORDER_TOP;
        }

        if (this.side === "right") {
            return STYLE_PROPS.BORDER_RIGHT;
        }

        if (this.side === "bottom") {
            return STYLE_PROPS.BORDER_BOTTOM;
        }

        if (this.side === "left") {
            return STYLE_PROPS.BORDER_LEFT;
        }

        return STYLE_PROPS.BORDER;
    }

    equals(other) {
        const { style, width, color, side } = this;

        return other.style === style && other.width.equals(width) && other.color.equals(color) && other.side === side;
    }

    getValue(params, colorNameResolver) {
        const { style, width, color } = this;

        return `${style} ${width.toStyleValue(params)} ${color.toStyleValue(params, colorNameResolver)}`;
    }
}

export default Border;
