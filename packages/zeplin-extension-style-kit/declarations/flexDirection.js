import { STYLE_PROPS } from "../constants";

class FlexDirection {
    constructor(value) {
        this.value = value;
    }

    get name() {
        return STYLE_PROPS.FLEX_DIRECTION;
    }

    equals(other) {
        return this.value === other.value;
    }

    getValue() {
        return this.value;
    }
}

export default FlexDirection;
