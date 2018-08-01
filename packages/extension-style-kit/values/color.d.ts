import { ColorParams, VariableMap } from "../common";

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

    toGradient(params: ColorParams): string;

    toStyleValue(params: ColorParams, variables: VariableMap): string;
}

export = Color;