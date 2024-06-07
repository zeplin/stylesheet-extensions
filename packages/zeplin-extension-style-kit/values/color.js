import { Color as ExtensionColor } from "@zeplin/extension-model";
import { getColorStringByFormat } from "../utils";

import Gradient from "./gradient";

class Color {
    constructor(colorObject, shouldDisplayDefaultValue) {
        this.object = colorObject;
        this.shouldDisplayDefaultValue = shouldDisplayDefaultValue;
    }

    static fromRGBA({ r, g, b, a = 1 }) {
        return new Color(new ExtensionColor({ r, g, b, a }));
    }

    valueOf() {
        const { r, g, b, a } = this.object;

        return `color::r:${r}:g:${g}:b:${b}:a:${a}`;
    }

    equals(other) {
        return this.object.equals(other.object);
    }

    toGradient() {
        const { r, g, b, a } = this.object;

        return Gradient.fromRGBA({ r, g, b, a });
    }

    toStyleValue(
        { colorFormat },
        colorNameResolver
    ) {
        if (colorNameResolver) {
            const colorName = colorNameResolver(this.object, this.shouldDisplayDefaultValue);
            if (colorName) {
                return colorName;
            }
        }

        return getColorStringByFormat(this.object, colorFormat);
    }
}

export default Color;
