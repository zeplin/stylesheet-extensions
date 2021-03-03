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

    getValue(params, container, formatColorVariable) {
        return this.source.toStyleValue(params, container, formatColorVariable);
    }
}

export default BorderImageSource;
