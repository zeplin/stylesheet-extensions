import { StyleValue } from "../common";
import { Scalar } from "./scalar";

type AngleUnit = "deg" | "rad" | "grad" | "turn";

export class Angle implements StyleValue {
    value: number;
    unit: AngleUnit;

    constructor(value: number, unit: AngleUnit = "deg") {
        this.value = value;
        this.unit = unit;
    }

    valueOf(): string {
        const { value, unit } = this;
        return `angle::v:${value}:u:${unit}`;
    }

    equals(other: Angle): boolean {
        return this.value === other.value && this.unit === other.unit;
    }

    toStyleValue(): string {
        return this.value === 0 ? "0" : `${new Scalar(this.value).toStyleValue()}${this.unit}`;
    }
}
