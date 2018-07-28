import Scalar from "../values/scalar";

declare class BorderImageSlice {
    constructor(value: Scalar);

    name: string;

    equals(other: BorderImageSlice): boolean;

    getValue(): string;
}

export = BorderImageSlice;