import { STYLE_PROPS } from "../constants";

class Opacity {
    constructor(value) {
        this.value = value;
    }

    get name() {
        return STYLE_PROPS.OPACITY;
    }

    equals(other) {
        return this.value.equals(other.value);
    }

    getValue() {
        return this.value.toStyleValue();
    }
}

export default Opacity;
