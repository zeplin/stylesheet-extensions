declare class TextFillColor {
    constructor(value: string);

    name: string;

    equals(other: TextFillColor): boolean;

    getValue(): string;
}

export = TextFillColor;