import { STYLE_PROPS } from "../constants";

class FontFamily {
    constructor(value) {
        this.value = value;
    }

    get name() {
        return STYLE_PROPS.FONT_FAMILY;
    }

    equals(other) {
        return this.value === other.value;
    }

    getValue() {
        return this.value;
    }
}

export default FontFamily;