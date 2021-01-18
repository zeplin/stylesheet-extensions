import { STYLE_PROPS } from "../constants";

class FlexGrow {
    constructor(value) {
        this.value = value;
    }

    get name() {
        return STYLE_PROPS.FLEX_GROW;
    }

    equals(other) {
        return this.value.equals(other.value);
    }

    getValue() {
        return this.value.toStyleValue();
    }
}

export default FlexGrow;
