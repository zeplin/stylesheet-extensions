import { ColorParams } from "../../common";

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

    // TODO: add @zeplin/extension-model types
    toStyleValue(params: ColorParams, colorNameResolver: (colorObject: object) => string): string;
}

export = Gradient;
