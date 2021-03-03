import { ColorParams } from "../common";
import Color from "../values/color"

declare class FontColor {
    constructor(value: Color);

    name: string;

    hasDefaultValue(): boolean;

    equals(other: FontColor): boolean;

    getValue(params: ColorParams, container: object, formatColorVariable: (colorObject: object) => string): string;
}

export = FontColor;
