import { ColorNameResolver, ColorParams, LengthParams, StyleDeclaration } from "../common";
import { STYLE_PROPS } from "../constants";
import { Length } from "../values";
import { Color } from "../values/color";

export type BorderSide = "top" | "right" | "bottom" | "left" | "all";
export type BorderStyle =
    "none"
    | "hidden"
    | "dotted"
    | "dashed"
    | "solid"
    | "double"
    | "groove"
    | "ridge"
    | "inset"
    | "outset";

export interface BorderOptions {
    style: BorderStyle;
    width: Length;
    color: Color;
    side: BorderSide;
}

export class Border implements StyleDeclaration {
    private style: BorderStyle;
    private width: Length;
    private color: Color;
    private side: BorderSide;

    constructor({ style, width, color, side }: BorderOptions) {
        this.style = style;
        this.width = width;
        this.color = color;
        this.side = side;
    }

    get name(): string {
        if (this.side === "top") {
            return STYLE_PROPS.BORDER_TOP;
        }

        if (this.side === "right") {
            return STYLE_PROPS.BORDER_RIGHT;
        }

        if (this.side === "bottom") {
            return STYLE_PROPS.BORDER_BOTTOM;
        }

        if (this.side === "left") {
            return STYLE_PROPS.BORDER_LEFT;
        }

        return STYLE_PROPS.BORDER;
    }

    equals(other: Border): boolean {
        const { style, width, color, side } = this;
        return other.style === style &&
            other.width.equals(width) &&
            other.color.equals(color) &&
            other.side === side;
    }

    getValue(params: LengthParams & ColorParams, colorNameResolver: ColorNameResolver): string {
        const { style, width, color } = this;
        return `${style} ${width.toStyleValue(params)} ${color.toStyleValue(params, colorNameResolver)}`;
    }
}

