import { STYLE_PROPS } from "../constants";

class BorderImageSlice {
    constructor(value) {
        this.value = value;
    }

    get name() {
        return STYLE_PROPS.BORDER_IMAGE_SLICE;
    }

    equals(other) {
        return this.value.equals(other.value);
    }

    getValue(params, variables) {
        return this.value.toStyleValue(params, variables);
    }
}

export default BorderImageSlice;