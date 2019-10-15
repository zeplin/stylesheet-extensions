declare class FontVariationSettings {
    constructor(axes: object);

    name: string;

    hasDefaultValue(): boolean;

    equals(other: FontVariationSettings): boolean;

    getValue(): string;
}

export = FontVariationSettings;
