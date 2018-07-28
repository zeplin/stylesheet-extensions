import { VariableMap, StyleParams } from "../common";
import Scalar from "../values/scalar";

declare class Opacity {
    constructor(value: Scalar);

    name: string;

    equals(other: Opacity): boolean;

    getValue(params: StyleParams, variables: VariableMap): string;
}

export = Opacity;