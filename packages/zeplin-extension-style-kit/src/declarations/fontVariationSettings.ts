import { STYLE_PROPS } from "../constants";
import { Scalar } from "../values";
import { StyleDeclaration } from "../common";

interface FontAxes {
    [key: string]: number | Scalar;
}

export class FontVariationSettings implements StyleDeclaration {
    private axes: FontAxes;

    constructor(axes: FontAxes) {
        this.axes = axes;
    }

    static get DEFAULT_VALUE(): FontAxes {
        return {};
    }

    get name(): string {
        return STYLE_PROPS.FONT_VARIATION_SETTINGS;
    }

    equals(other: FontVariationSettings): boolean {
        const axisNames = Object.keys(this.axes);

        if (axisNames.length !== Object.keys(other.axes).length) {
            return false;
        }

        return axisNames.every(axisName => this.axes[axisName] === other.axes[axisName]);
    }

    hasDefaultValue(): boolean {
        return Object.keys(this.axes).length === 0;
    }

    getValue(): string {
        if (this.hasDefaultValue()) {
            return "normal";
        }

        return Object.entries(this.axes)
            .map(([axis, value]) => `"${axis}" ${value instanceof Scalar ? value.toStyleValue() : value}`)
            .join(", ");
    }
}
