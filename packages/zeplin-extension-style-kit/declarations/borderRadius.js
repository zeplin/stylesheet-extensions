import { STYLE_PROPS } from "../constants";

class BorderRadius {
    constructor(length) {
        this.value = length;
    }

    get name() {
        return STYLE_PROPS.BORDER_RADIUS;
    }

    equals(other) {
        return this.value.equals(other.value);
    }

    getValue(params) {
        return this.value.toStyleValue(params);
    }
}

export default BorderRadius;
