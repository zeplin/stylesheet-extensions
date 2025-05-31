import { StyleDeclaration } from "../common.js";
import { STYLE_PROPS } from "../constants.js";

export type BlendMode =
    | "normal"
    | "multiply"
    | "screen"
    | "overlay"
    | "darken"
    | "lighten"
    | "color-dodge"
    | "color-burn"
    | "hard-light"
    | "soft-light"
    | "difference"
    | "exclusion"
    | "hue"
    | "saturation"
    | "color"
    | "luminosity";

export class BackgroundBlendMode implements StyleDeclaration {
    private values: BlendMode[];

    constructor(values: BlendMode[]) {
        this.values = values;
    }

    get name(): string {
        return STYLE_PROPS.BACKGROUND_BLEND_MODE;
    }

    equals(other: BackgroundBlendMode): boolean {
        return this.values.join(", ") === other.values.join(", ");
    }

    getValue(): string {
        return this.values.join(", ");
    }
}
