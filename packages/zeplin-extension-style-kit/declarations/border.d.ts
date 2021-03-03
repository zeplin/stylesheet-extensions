import { ColorParams, LengthParams } from "../common";
import Color from "../values/color";
import Length from "../values/length";

declare class Border {
    constructor(values: { style: string, width: Length, color: Color });

    name: string;

    equals(other: Border): boolean;

    getValue(params: ColorParams & LengthParams, container, formatColorVariable): string;
}

export = Border;
