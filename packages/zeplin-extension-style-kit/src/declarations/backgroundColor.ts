import { STYLE_PROPS } from "../constants";
import { Color } from "../values";
import { ColorNameResolver, ColorParams, StyleDeclaration } from "../common";

export class BackgroundColor implements StyleDeclaration {
    private color: Color;

    constructor(color: Color) {
        this.color = color;
    }

    get name(): string {
        return STYLE_PROPS.BACKGROUND_COLOR;
    }

    equals(other: BackgroundColor): boolean {
        return this.color.equals(other.color);
    }

    getValue(params: ColorParams, colorNameResolver: ColorNameResolver): string {
        return this.color.toStyleValue(params, colorNameResolver);
    }
}
