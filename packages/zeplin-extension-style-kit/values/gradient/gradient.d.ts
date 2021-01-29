import { ColorParams, VariableMap } from "../../common";

interface RGBA {
    r: number;
    g: number;
    b: number;
    a: number;
}

declare class Gradient {
    constructor(gradientObject: object);

    static fromRGBA(rgba: RGBA): Gradient;

    equals(other: Gradient): boolean;

    toStyleValue(params: ColorParams, variables: VariableMap): string;
}

export = Gradient;
