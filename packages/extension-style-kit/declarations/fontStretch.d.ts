declare class FontStretch {
    constructor(value: string);

    name: string;

    hasDefaultValue(): boolean;

    equals(other: FontStretch): boolean;

    getValue(): string;
}

export = FontStretch;