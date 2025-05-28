import { ColorNameResolver, ColorParams, StyleValue } from "../../common";
import { Angle } from "../angle";
import { Color } from "../color";
import { Color as ExtensionColor, ColorStop } from "@zeplin/extension-model";

export class AngularColorStop implements StyleValue {
    private color: ExtensionColor;
    private position: number;

    constructor(colorStopObject: ColorStop) {
        const { color, position } = colorStopObject;
        this.color = color;
        this.position = position;
    }

    valueOf() {
        const { position, color: { r, g, b, a = 1 } } = this;

        return `angularColorStop::p:${position}:r:${r}:g:${g}:b:${b}:a:${a}`;
    }

    equals(other: AngularColorStop): boolean {

        return this.position === other.position && this.color.equals(other.color);
    }

    toStyleValue({ colorFormat }: ColorParams, colorNameResolver: ColorNameResolver): string {
        const { position, color } = this;

        const stopColor = new Color(color).toStyleValue({ colorFormat }, colorNameResolver);

        if (!position || position === 1) {
            return stopColor;
        }

        return `${stopColor} ${new Angle(position, "turn").toStyleValue()}`;
    }
}
