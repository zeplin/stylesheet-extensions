declare class TextAlign {
    constructor(value: string);

    name: string;

    hasDefaultValue(): boolean;

    equals(other: TextAlign): boolean;

    getValue(): string;
}

export = TextAlign;