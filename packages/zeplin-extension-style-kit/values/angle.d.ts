declare class Angle {
    constructor(value: number, unit = "deg");

    equals(other: Angle): boolean;

    toStyleValue(): string;
}

export = Angle;