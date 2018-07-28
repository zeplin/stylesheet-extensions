import { ColorParams, VariableMap } from "../common";
import Gradient from "../values/gradient";

declare class BgImage {
    constructor(images: Gradient[]);

    name: string;

    equals(other: BgImage): boolean;

    getValue(params: ColorParams, variables: VariableMap): string;
}

export = BgImage;