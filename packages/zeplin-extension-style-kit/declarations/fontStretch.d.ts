declare class FontStretch {
    constructor(value: string | number);

    name: string;

    hasDefaultValue(): boolean;

    equals(other: FontStretch): boolean;

    getValue(): string;
}

export = FontStretch;
