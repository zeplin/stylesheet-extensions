import { STYLE_PROPS } from "../constants";

class BackgroundClip {
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

export default BackgroundClip;