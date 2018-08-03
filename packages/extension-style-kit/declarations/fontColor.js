import Color from "../values/color";
import { STYLE_PROPS } from "../constants";

class FontColor {
    constructor(value) {
        this.value = value;
    }

    static get DEFAULT_VALUE() {
        return Color.fromRGBA({ r: 0, g: 0, b: 0, a: 1 });
    }

    get name() {
        return STYLE_PROPS.FONT_COLOR;
    }

    hasDefaultValue() {
        return this.value.equals(FontColor.DEFAULT_VALUE);
    }

    equals(other) {
        return this.value.equals(other.value);
    }

    getValue(params, variables) {
        return this.value.toStyleValue(params, variables);
    }
}

export default FontColor;