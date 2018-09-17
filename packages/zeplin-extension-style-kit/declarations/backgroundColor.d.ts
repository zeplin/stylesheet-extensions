import { ColorParams, VariableMap } from "../common";
import Color from "../values/color";

declare class BackgroundColor {
    constructor(color: Color);

    name: string;

    equals(other: BackgroundColor): boolean;

    getValue(params: ColorParams, variables: VariableMap): string;
}

export = BackgroundColor;