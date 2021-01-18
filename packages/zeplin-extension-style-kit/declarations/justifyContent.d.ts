declare class JustifyContent {
    constructor(value: string);

    name: string;

    hasDefaultValue(): boolean;

    equals(other: JustifyContent): boolean;

    getValue(): string;
}

export = JustifyContent;
