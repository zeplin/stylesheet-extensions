declare class BgClip {
    constructor(values: string[]);

    name: string;

    equals(other: BgClip): boolean;

    getValue(): string;
}

export = BgClip;