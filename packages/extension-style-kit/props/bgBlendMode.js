import { STYLE_PROPS } from "../constants";

class BgBlendMode {
    constructor(values) {
        this.values = values;
    }

    get name() {
        return STYLE_PROPS.BLEND_MODE;
    }

    equals(other) {
        return Array.from(this.values).sort().join(", ") === Array.from(other.values).sort().join(", ");
    }

    getValue() {
        return this.values.join(", ");
    }
}

export default BgBlendMode;