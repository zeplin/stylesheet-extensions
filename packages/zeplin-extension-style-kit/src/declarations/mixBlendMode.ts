import { StyleDeclaration } from "../common.js";
import { STYLE_PROPS } from "../constants.js";

export type BlendModeValue =
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

export class MixBlendMode implements StyleDeclaration {
    private value: BlendModeValue;

    constructor(value: BlendModeValue) {
        this.value = value;
    }

    get name(): string {
        return STYLE_PROPS.BLEND_MODE;
    }

    equals(other: MixBlendMode): boolean {
        return this.value === other.value;
    }

    getValue(): BlendModeValue {
        return this.value;
    }
}
