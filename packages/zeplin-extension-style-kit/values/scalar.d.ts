declare class Scalar {
    constructor(value: number);

    equals(other: Scalar): boolean;

    toStyleValue(): string;
}

export = Scalar;