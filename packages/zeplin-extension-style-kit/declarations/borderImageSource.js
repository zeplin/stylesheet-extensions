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

    getValue(params, colorNameResolver) {
        return this.source.toStyleValue(params, colorNameResolver);
    }
}

export default BorderImageSource;
