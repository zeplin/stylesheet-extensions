import { STYLE_PROPS } from "../constants";

class BackgroundOrigin {
    constructor(values) {
        this.values = values;
    }

    get name() {
        return STYLE_PROPS.BACKGROUND_ORIGIN;
    }

    equals(other) {
        return this.values.join(", ") === other.values.join(", ");
    }

    getValue() {
        return this.values.join(", ");
    }
}

export default BackgroundOrigin;