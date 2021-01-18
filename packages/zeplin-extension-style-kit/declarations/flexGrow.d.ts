import Scalar from "../values/scalar";

declare class FlexGrow {
    constructor(value: Scalar);

    name: string;

    equals(other: FlexGrow): boolean;

    getValue(): string;
}

export = FlexGrow;
