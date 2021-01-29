declare class FlexDirection {
    constructor(value: string);

    name: string;

    hasDefaultValue(): boolean;

    equals(other: FlexDirection): boolean;

    getValue(): string;
}

export = FlexDirection;
