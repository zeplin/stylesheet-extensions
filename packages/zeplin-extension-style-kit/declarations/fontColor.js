import { STYLE_PROPS } from "../constants";

class FontColor {
    constructor(value) {
        this.value = value;
    }

    get name() {
        return STYLE_PROPS.FONT_COLOR;
    }

    equals(other) {
        return this.value.equals(other.value);
    }

    getValue(params, getColorName) {
        return this.value.toStyleValue(params, getColorName);
    }
}

export default FontColor;
