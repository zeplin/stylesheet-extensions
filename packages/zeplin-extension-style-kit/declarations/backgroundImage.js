import { STYLE_PROPS } from "../constants";

class BackgroundImage {
    constructor(images) {
        this.images = images;
    }

    get name() {
        return STYLE_PROPS.BACKGROUND_IMAGE;
    }

    equals(other) {
        return (
            this.images.length === other.images.length &&
            this.images.every((img, index) => img.equals(other.images[index]))
        );
    }

    getValue(params, variables) {
        return this.images.map(img => img.toStyleValue(params, variables)).join(", ");
    }
}

export default BackgroundImage;