import { StyleParams, StyleValue } from "../../common";

interface FourDirectionalValueOptions<T> {
    top: T;
    right: T;
    bottom: T;
    left: T;
}

export class FourDirectionalValue<T extends StyleValue> implements StyleValue {
    top: T;
    right: T;
    bottom: T;
    left: T;

    constructor({ top, right, bottom, left }: FourDirectionalValueOptions<T>) {
        this.top = top;
        this.right = right;
        this.bottom = bottom;
        this.left = left;
    }

    valueOf(): string {
        return `fourDirectionalValue::t:(${this.top.valueOf()}):r:(${this.right.valueOf()}):b:(${this.bottom.valueOf()}):l:(${this.left.valueOf()})`;
    }

    equals(other: FourDirectionalValue<T>): boolean {
        return this.top.equals(other.top) &&
            this.right.equals(other.right) &&
            this.bottom.equals(other.bottom) &&
            this.left.equals(other.left);
    }

    toStyleValue(params: StyleParams): string {
        if (this.top.equals(this.bottom) && this.right.equals(this.left) && this.top.equals(this.right)) {
            return this.top.toStyleValue(params);
        }

        if (this.top.equals(this.bottom) && this.right.equals(this.left)) {
            return `${this.top.toStyleValue(params)} ${this.right.toStyleValue(params)}`;
        }

        if (this.right.equals(this.left)) {
            return `${this.top.toStyleValue(params)} ${this.right.toStyleValue(params)} ${this.bottom.toStyleValue(params)}`;
        }

        return `${this.top.toStyleValue(params)} ${this.right.toStyleValue(params)} ${this.bottom.toStyleValue(params)} ${this.left.toStyleValue(params)}`;
    }
}
