declare class AlignItems {
    constructor(value: string);

    name: string;

    hasDefaultValue(): boolean;

    equals(other: AlignItems): boolean;

    getValue(): string;
}

export = AlignItems;
