import { ColorParams, VariableMap } from "../common";
import Color from "../values/color";

declare class BgColor {
    constructor(color: Color);

    name: string;

    equals(other: BgColor): boolean;

    getValue(params: ColorParams, variables: VariableMap): string;
}

export = BgColor;