import { STYLE_PROPS } from "../constants";

const valueMapper = {
    center: "center",
    max: "flex-end",
    min: "flex-start",
    stretch: "stretch",
    inherit: "inherit"
};

class AlignSelf {
    constructor(value) {
        this.value = value;
    }

    get name() {
        return STYLE_PROPS.ALIGN_SELF;
    }

    equals(other) {
        return this.value === other.value;
    }

    getValue() {
        return valueMapper[this.value];
    }
}

export default AlignSelf;
