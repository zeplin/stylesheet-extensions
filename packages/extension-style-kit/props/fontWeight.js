import { STYLE_PROPS } from "../constants";

const WEIGHT_BOLD = 700;
const WEIGHT_NORMAL = 400;

class FontWeight {
    constructor(value) {
        this.value = value;
    }

    static get DEFAULT_VALUE() {
        return WEIGHT_NORMAL;
    }

    get name() {
        return STYLE_PROPS.FONT_WEIGHT;
    }

    hasDefaultValue() {
        return this.value === WEIGHT_NORMAL;
    }

    equals(other) {
        return this.value === other.value;
    }

    getValue() {
        const { value } = this;

        if (value === WEIGHT_BOLD) {
            return "bold";
        } else if (value === WEIGHT_NORMAL) {
            return "normal";
        }

        return value;
    }
}

export default FontWeight;