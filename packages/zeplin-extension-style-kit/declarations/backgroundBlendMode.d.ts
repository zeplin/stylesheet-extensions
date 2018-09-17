declare class BackgroundBlendMode {
    constructor(values: string[]);

    name: string;

    equals(other: BackgroundBlendMode): boolean;

    getValue(): string;
}

export = BackgroundBlendMode;