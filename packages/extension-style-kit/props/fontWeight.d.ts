declare class FontWeight {
    constructor(value: number);

    name: string;

    hasDefaultValue(): boolean;

    equals(other: FontWeight): boolean;

    getValue(): string;
}

export = FontWeight;