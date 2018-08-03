declare class BgOrigin {
    constructor(values: string[]);

    name: string;

    equals(other: BgOrigin): boolean;

    getValue(): string;
}

export = BgOrigin;