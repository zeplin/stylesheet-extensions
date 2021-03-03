import { STYLE_PROPS } from "../constants";

class Height {
    constructor(length) {
        this.value = length;
    }

    get name() {
        return STYLE_PROPS.HEIGHT;
    }

    equals(other) {
        return this.value.equals(other.value);
    }

    getValue(params) {
        return this.value.toStyleValue(params);
    }
}

export default Height;
