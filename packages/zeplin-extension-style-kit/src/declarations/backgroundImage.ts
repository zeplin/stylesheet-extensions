import { STYLE_PROPS } from "../constants.js";
import { ColorNameResolver, StyleDeclaration, StyleParams, StyleValue } from "../common.js";

export class BackgroundImage implements StyleDeclaration {
    private images: StyleValue[];

    constructor(images: StyleValue[]) {
        this.images = images;
    }

    get name(): string {
        return STYLE_PROPS.BACKGROUND_IMAGE;
    }

    equals(other: BackgroundImage): boolean {
        return (
            this.images.length === other.images.length &&
            this.images.every((img, index) => img.equals(other.images[index]))
        );
    }

    getValue(params: StyleParams, colorNameResolver: ColorNameResolver): string {
        return this.images.map(img => img.toStyleValue(params, colorNameResolver)).join(", ");
    }
}
