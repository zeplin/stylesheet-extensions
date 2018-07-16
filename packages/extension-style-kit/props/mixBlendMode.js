import { STYLE_PROPS } from "../constants";

class MixBlendMode {
    constructor(value) {
        this.value = value;
    }

    get name() {
        return STYLE_PROPS.BLEND_MODE;
    }

    equals(other) {
        return this.value === other.value;
    }

    getValue() {
        return this.value;
    }
}

export default MixBlendMode;