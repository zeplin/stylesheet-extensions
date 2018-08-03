import { STYLE_PROPS } from "../constants";

class ObjectFit {
    constructor(value) {
        this.value = value;
    }

    get name() {
        return STYLE_PROPS.OBJECT_FIT;
    }

    equals(other) {
        return this.value === other.value;
    }

    getValue() {
        return this.value;
    }
}

export default ObjectFit;