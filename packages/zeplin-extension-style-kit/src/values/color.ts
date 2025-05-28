import { Color as ExtensionColor } from "@zeplin/extension-model";
import { getColorStringByFormat } from "../utils";
import { Gradient } from "./gradient";
import { ColorParams, StyleValue } from "../common";

export interface RGBAColor {
    r: number;
    g: number;
    b: number;
    a?: number;
}

export class Color implements StyleValue {
    object: ExtensionColor;
    shouldDisplayDefaultValue: boolean;

    constructor(colorObject: ExtensionColor, shouldDisplayDefaultValue = false) {
        this.object = colorObject;
        this.shouldDisplayDefaultValue = shouldDisplayDefaultValue;
    }

    static fromRGBA({ r, g, b, a = 1 }: RGBAColor): Color {
        return new Color(new ExtensionColor({ r, g, b, a }));
    }

    valueOf(): string {
        const { r, g, b, a } = this.object;
        return `color::r:${r}:g:${g}:b:${b}:a:${a}`;
    }

    equals(other: Color): boolean {
        return this.object.equals(other.object);
    }

    toGradient(): Gradient {
        const { r, g, b, a } = this.object;
        return Gradient.fromRGBA({ r, g, b, a });
    }

    toStyleValue(params: ColorParams, colorNameResolver?: (color: ExtensionColor, shouldDisplayDefaultValue?: boolean) => string): string {
        const { colorFormat } = params;
        if (colorNameResolver) {
            const colorName = colorNameResolver(this.object, this.shouldDisplayDefaultValue);
            if (colorName) {
                return colorName;
            }
        }
        return getColorStringByFormat(this.object, colorFormat);
    }
}
