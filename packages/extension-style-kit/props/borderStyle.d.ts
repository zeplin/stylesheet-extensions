declare class BorderStyle {
    constructor(value: string);

    name: string;

    equals(other: BorderStyle): boolean;

    getValue(): string;
}

export = BorderStyle;