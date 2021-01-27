import { STYLE_PROPS } from "../constants";

class Display {
    constructor(value) {
        this.value = value;
    }

    get name() {
        return STYLE_PROPS.DISPLAY;
    }

    equals(other) {
        return this.value === other.value;
    }

    getValue() {
        return this.value;
    }

    static flex() {
        return new Display("flex");
    }
}

export default Display;
