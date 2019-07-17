declare class FontSrc {
    constructor(fontFace: string);

    name: string;

    hasDefaultValue(): boolean;

    equals(other: FontSrc): boolean;

    getValue(): string;
}

export = FontSrc;
