import { STYLE_PROPS } from "../constants";

class Width {
    constructor(length) {
        this.value = length;
    }

    get name() {
        return STYLE_PROPS.WIDTH;
    }

    equals(other) {
        return this.value.equals(other.value);
    }

    getValue(params, variables) {
        return this.value.toStyleValue(Object.assign({}, params, { useRemUnit: false }), variables);
    }
}

export default Width;