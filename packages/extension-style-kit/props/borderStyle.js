import { STYLE_PROPS } from "../constants";

class BorderStyle {
    constructor(value) {
        this.value = value;
    }

    get name() {
        return STYLE_PROPS.BORDER_STYLE;
    }

    equals(other) {
        return this.value === other.value;
    }

    getValue() {
        return this.value;
    }
}

export default BorderStyle;