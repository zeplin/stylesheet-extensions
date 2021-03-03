import { STYLE_PROPS } from "../constants";

class BackgroundColor {
    constructor(color) {
        this.color = color;
    }

    get name() {
        return STYLE_PROPS.BACKGROUND_COLOR;
    }

    equals(other) {
        return this.color.equals(other.color);
    }

    getValue(params, container, formatColorVariable) {
        return this.color.toStyleValue(params, container, formatColorVariable);
    }
}

export default BackgroundColor;
