import { STYLE_PROPS } from "../constants";

class BackgroundBlendMode {
    constructor(values) {
        this.values = values;
    }

    get name() {
        return STYLE_PROPS.BACKGROUND_BLEND_MODE;
    }

    equals(other) {
        return this.values.join(", ") === other.values.join(", ");
    }

    getValue() {
        return this.values.join(", ");
    }
}

export default BackgroundBlendMode;