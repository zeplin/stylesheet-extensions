interface FourDirectionalValueParams<T> {
    top: T;
    right: T;
    bottom: T;
    left: T;
}
declare class FourDirectionalValue<T extends {toStyleValue: Function}> {
    constructor(value: FourDirectionalValueParams<T>);

    equals(other: FourDirectionalValue<T>): boolean;

    toStyleValue: T["toStyleValue"];
}

export = FourDirectionalValue;
