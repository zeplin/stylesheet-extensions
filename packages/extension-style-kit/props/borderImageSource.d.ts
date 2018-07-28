import { ColorParams, VariableMap } from "../common";
import Gradient from "../values/gradient";

declare class BorderImageSource {
    constructor(images: Gradient[]);

    name: string;

    equals(other: BorderImageSource): boolean;

    getValue(params: ColorParams, variables: VariableMap): string;
}

export = BorderImageSource;