import { ColorParams, LengthParams } from "../common";
import Color from "../values/color";
import Gradient from "../values/gradient";
import Length from "../values/length";

declare class Shadow {
    constructor(shadowObjects: object[], type: string);

    name: string;

    equals(other: Shadow): boolean;

    getValue(params: ColorParams & LengthParams, getColorName: (colorObject: object) => string): string;
}

export = Shadow;
