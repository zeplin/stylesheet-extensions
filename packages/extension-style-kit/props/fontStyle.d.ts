declare class FontStyle {
    constructor(value: string);

    name: string;

    hasDefaultValue(): boolean;

    equals(other: FontStyle): boolean;

    getValue(): string;
}

export = FontStyle;