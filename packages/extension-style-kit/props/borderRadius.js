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

    getValue(params, variables) {
        return this.value.toStyleValue(params, variables);
    }
}

export default BorderRadius;