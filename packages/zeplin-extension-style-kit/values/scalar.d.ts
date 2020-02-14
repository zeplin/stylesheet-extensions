declare class Scalar {
    constructor(value: number, precision?: number);

    equals(other: Scalar): boolean;

    toStyleValue(): string;
}

export = Scalar;