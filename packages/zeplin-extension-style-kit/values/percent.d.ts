declare class Percent {
    constructor(value: number);

    equals(other: Percent): boolean;

    toStyleValue(): string;
}

export = Percent;