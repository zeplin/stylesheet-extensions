import { STYLE_PROPS } from "../constants";

class BgClip {
    constructor(value) {
        this.value = value;
    }

    get name() {
        return STYLE_PROPS.BACKGROUND_CLIP;
    }

    equals(other) {
        return this.value === other.value;
    }

    getValue() {
        return this.value;
    }
}

export default BgClip;