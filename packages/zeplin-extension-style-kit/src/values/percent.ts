import { StyleValue } from "../common";

const HUNDRED = 100;

export class Percent implements StyleValue {
    value: number;

    constructor(value: number) {
        this.value = value;
    }

    valueOf(): string {
        const { value } = this;
        return `percent::v:${value}`;
    }

    equals(other: Percent): boolean {
        return this.value === other.value;
    }

    toStyleValue(): string {
        const { value } = this;
        return value !== 0 ? `${Math.round(value * HUNDRED)}%` : "0";
    }
}
