declare class BackgroundClip {
    constructor(values: string[]);

    name: string;

    equals(other: BackgroundClip): boolean;

    getValue(): string;
}

export = BackgroundClip;