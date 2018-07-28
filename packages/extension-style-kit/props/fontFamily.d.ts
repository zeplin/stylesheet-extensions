declare class FontFamily {
    constructor(value: string);

    name: string;

    hasDefaultValue(): boolean;

    equals(other: FontFamily): boolean;

    getValue(): string;
}

export = FontFamily;