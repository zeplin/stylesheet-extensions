import { ColorParams } from "../common";
import Color from "../values/color";

declare class BackgroundColor {
    constructor(color: Color);

    name: string;

    equals(other: BackgroundColor): boolean;

    getValue(params: ColorParams, colorNameResolver: (colorObject: object) => string): string;
}

export = BackgroundColor;
