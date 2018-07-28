declare class MixBlendMode {
    constructor(value: string);

    name: string;

    equals(other: MixBlendMode): boolean;

    getValue(): string;
}

export = MixBlendMode;