import { ColorParams, LengthParams } from "../common";
import Color from "../values/color";
import Length from "../values/length";

declare class Border {
    constructor(values: { style: string, width: Length, color: Color });

    name: string;

    equals(other: Border): boolean;

    getValue(params: ColorParams & LengthParams, getColorName: (colorObject: object) => string): string;
}

export = Border;
