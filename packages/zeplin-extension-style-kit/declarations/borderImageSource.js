import { STYLE_PROPS } from "../constants";

class BorderImageSource {
    constructor(source) {
        this.source = source;
    }

    get name() {
        return STYLE_PROPS.BORDER_IMAGE_SOURCE;
    }

    equals(other) {
        return this.source.equals(other.source);
    }

    getValue(params, getColorName) {
        return this.source.toStyleValue(params, getColorName);
    }
}

export default BorderImageSource;
