import { ColorParams, VariableMap } from "../common";
import Gradient from "./gradient";

interface RGBA {
    r: number;
    g: number;
    b: number;
    a: number;
}

declare class Color {
    constructor(colorObject: object);

    static fromRGBA(rgba: RGBA): Color;

    equals(other: Color): boolean;

    toGradient(): Gradient;

    // TODO: add @zeplin/extension-model types
    toStyleValue(params: ColorParams, getColorName: (colorObject: object) => string): string;
}

export = Color;
