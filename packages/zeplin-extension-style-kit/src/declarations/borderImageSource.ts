import { Gradient } from "../values/gradient";
import { STYLE_PROPS } from "../constants";
import { StyleDeclaration } from "../common";

export class BorderImageSource implements StyleDeclaration {
    private source: Gradient;

    constructor(source: Gradient) {
        this.source = source;
    }

    get name(): string {
        return STYLE_PROPS.BORDER_IMAGE_SOURCE;
    }

    equals(other: BorderImageSource): boolean {
        return this.source.equals(other.source);
    }

    getValue(params: any, colorNameResolver: any): string {
        return this.source.toStyleValue(params, colorNameResolver);
    }
}
