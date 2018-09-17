declare class BackgroundOrigin {
    constructor(values: string[]);

    name: string;

    equals(other: BackgroundOrigin): boolean;

    getValue(): string;
}

export = BackgroundOrigin;