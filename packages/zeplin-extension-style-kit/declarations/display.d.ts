declare class Display {
    constructor(value: string);

    name: string;

    hasDefaultValue(): boolean;

    equals(other: Display): boolean;

    getValue(): string;
}

export = Display;
