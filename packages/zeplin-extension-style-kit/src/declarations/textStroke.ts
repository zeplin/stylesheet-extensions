import { ColorNameResolver, ColorParams, LengthParams, StyleDeclaration } from "../common";
import { STYLE_PROPS } from "../constants";
import { Color } from "../values";
import { Length } from "../values";

export class TextStroke implements StyleDeclaration {
    private length: Length;
    private color: Color;

    constructor(length: Length, color: Color) {
        this.length = length;
        this.color = color;
    }

    get name(): string {
        return STYLE_PROPS.TEXT_STROKE;
    }

    equals(other: TextStroke): boolean {
        return this.length.equals(other.length) && this.color.equals(other.color);
    }

    getValue(params: LengthParams & ColorParams, colorNameResolver: ColorNameResolver): string {
        const { color, length } = this;
        return `${length.toStyleValue(params)} ${color.toStyleValue(params, colorNameResolver)}`;
    }
}
