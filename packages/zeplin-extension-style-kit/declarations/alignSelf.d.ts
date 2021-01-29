declare class AlignSelf {
    constructor(value: string);

    name: string;

    hasDefaultValue(): boolean;

    equals(other: AlignSelf): boolean;

    getValue(): string;
}

export = AlignSelf;
