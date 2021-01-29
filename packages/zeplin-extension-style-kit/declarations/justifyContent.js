import { STYLE_PROPS } from "../constants";

const valueMapper = {
    "center": "center",
    "max": "flex-end",
    "min": "flex-start",
    "space-between": "space-between"
};

class JustifyContent {
    constructor(value) {
        this.value = value;
    }

    get name() {
        return STYLE_PROPS.JUSTIFY_CONTENT;
    }

    equals(other) {
        return this.value === other.value;
    }

    getValue() {
        return valueMapper[this.value];
    }
}

export default JustifyContent;
