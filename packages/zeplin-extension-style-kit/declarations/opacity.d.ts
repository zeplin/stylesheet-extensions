import Scalar from "../values/scalar";

declare class Opacity {
    constructor(value: Scalar);

    name: string;

    equals(other: Opacity): boolean;

    getValue(): string;
}

export = Opacity;
