import { ColorParams, VariableMap } from "../common";
import Gradient from "../values/gradient";

declare class BackgroundImage {
    constructor(images: Gradient[]);

    name: string;

    equals(other: BackgroundImage): boolean;

    getValue(params: ColorParams, variables: VariableMap): string;
}

export = BackgroundImage;