import { STYLE_PROPS } from "../constants";

class BorderWidth {
    constructor(width) {
        this.width = width;
    }

    get name() {
        return STYLE_PROPS.BORDER_WIDTH;
    }

    equals(other) {
        return this.width.equals(other.width);
    }

    getValue(params) {
        return this.width.toStyleValue(params);
    }
}

export default BorderWidth;
