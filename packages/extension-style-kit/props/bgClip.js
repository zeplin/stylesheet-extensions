import { STYLE_PROPS } from "../constants";

class BgClip {
    constructor(values) {
        this.values = values;
    }

    get name() {
        return STYLE_PROPS.BACKGROUND_CLIP;
    }

    equals(other) {
        return this.values.join(", ") === other.values.join(", ");
    }

    getValue() {
        return this.values.join(", ");
    }
}

export default BgClip;