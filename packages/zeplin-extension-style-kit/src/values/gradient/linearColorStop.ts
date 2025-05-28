import { ColorNameResolver, ColorParams, StyleValue } from "../../common";
import { Color as ExtensionColor, ColorStop } from "@zeplin/extension-model";
import { Color } from "../color";
import { Percent } from "../percent";

export class LinearColorStop implements StyleValue {
    color: ExtensionColor;
    position: number;

    constructor(colorStopObject: ColorStop) {
        const { color, position } = colorStopObject;
        this.color = color;
        this.position = position;
    }

    valueOf() {
        const { position, color: { r, g, b, a = 1 } } = this;

        return `linearColorStop::p:${position}:r:${r}:g:${g}:b:${b}:a:${a}`;
    }

    equals(other: LinearColorStop): boolean {
        return this.position === other.position && this.color.equals(other.color);
    }

    toStyleValue(params: ColorParams, colorNameResolver: ColorNameResolver): string {
        const { position, color } = this;

        const stopColor = new Color(color).toStyleValue(params, colorNameResolver);

        if (!position || position === 1) {
            return stopColor;
        }

        return `${stopColor} ${new Percent(position).toStyleValue()}`;
    }
}
