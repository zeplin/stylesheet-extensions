declare class BgBlendMode {
    constructor(values: string[]);

    name: string;

    equals(other: BgBlendMode): boolean;

    getValue(): string;
}

export = BgBlendMode;