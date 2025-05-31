import { ColorNameResolver, ColorParams, StyleDeclaration } from "../common.js";
import { STYLE_PROPS } from "../constants.js";
import { Color } from "../values/index.js";

export class FontColor implements StyleDeclaration {
    private value: Color;

    constructor(value: Color) {
        this.value = value;
    }

    get name(): string {
        return STYLE_PROPS.FONT_COLOR;
    }

    equals(other: FontColor): boolean {
        return this.value.equals(other.value);
    }

    getValue(params: ColorParams, colorNameResolver: ColorNameResolver): string {
        return this.value.toStyleValue(params, colorNameResolver);
    }
}
