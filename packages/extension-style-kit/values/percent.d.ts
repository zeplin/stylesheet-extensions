declare class Percent {
    constructor(value: number);

    equals(other: Scalar): boolean;

    toStyleValue(): string;
}

export = Percent;