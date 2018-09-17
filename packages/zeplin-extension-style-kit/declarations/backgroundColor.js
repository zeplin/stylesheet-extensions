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

    getValue(params, variables) {
        return this.color.toStyleValue(params, variables);
    }
}

export default BackgroundColor;