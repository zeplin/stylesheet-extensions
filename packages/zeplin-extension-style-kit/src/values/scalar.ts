import { StyleValue } from "../common";

function round(number: number, precision: number): number {
    const formattedNumber = Number(number).toLocaleString("en-US", {
        useGrouping: false,
        maximumFractionDigits: precision
    });

    return Number(formattedNumber);
}

const DEFAULT_PRECISION = 2;

interface ScalarOptions {
    precision?: number;
}

export class Scalar implements StyleValue {
    value: number;
    precision: number;

    constructor(value: number, options: number | ScalarOptions = {}) {
        this.value = value;

        if (typeof options === "number") {
            this.precision = options;
        } else {
            this.precision = options.precision ?? DEFAULT_PRECISION;
        }
    }

    valueOf(): string {
        const { value, precision } = this;
        return `scalar::v:${value}:p:${precision}`;
    }

    equals(other: Scalar): boolean {
        return this.value === other.value;
    }

    toStyleValue(): string {
        return `${round(this.value, this.precision)}`;
    }
}
