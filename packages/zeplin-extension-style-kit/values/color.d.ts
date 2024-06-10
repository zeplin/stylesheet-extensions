import { ColorParams, VariableMap } from "../common";
import Gradient from "./gradient";

interface RGBA {
    r: number;
    g: number;
    b: number;
    a: number;
}

declare class Color {
    constructor(colorObject: object, shouldDisplayDefaultValue: boolean);

    static fromRGBA(rgba: RGBA): Color;

    equals(other: Color): boolean;

    toGradient(): Gradient;

    // TODO: add @zeplin/extension-model types
    toStyleValue(params: ColorParams, colorNameResolver: (colorObject: object) => string): string;
}

export = Color;
