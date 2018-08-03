declare class ObjectFit {
    constructor(value: string);

    name: string;

    equals(other: ObjectFit): boolean;

    getValue(): string;
}

export = ObjectFit;