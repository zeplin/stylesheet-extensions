import { LengthOptions, LengthParams, RemPreferences, StyleValue } from "../common";
import { Scalar } from "./scalar";

const remPrecisionAddition = 2;

export class Length implements StyleValue {
    value: number;
    precision: number;
    useDensityDivisor: boolean;
    useRemUnit: (remPreferences: RemPreferences) => boolean;

    constructor(
        value: number,
        { precision = 1, useDensityDivisor = true, useRemUnit = false }: LengthOptions = {}
    ) {
        this.value = value;
        this.precision = precision;
        this.useDensityDivisor = useDensityDivisor;
        this.useRemUnit = (remPreferences: RemPreferences) => {
            if (!remPreferences?.rootFontSize) {
                return false;
            }
            return typeof useRemUnit === "function" ? useRemUnit(remPreferences) : useRemUnit;
        };
    }

    valueOf(): string {
        // Note: The original code references `unit` which wasn't defined in the constructor.
        // This might need to be addressed if it's used elsewhere.
        return `length::v:${this.value}`;
    }

    equals(other: Length): boolean {
        return this.value === other.value;
    }

    toStyleValue({ densityDivisor, remPreferences }: LengthParams): string {
        if (this.value === 0) {
            return "0";
        }

        const densityAwareValue = this.useDensityDivisor ? this.value / densityDivisor : this.value;
        if (remPreferences && this.useRemUnit(remPreferences)) {
            return `${new Scalar(
                densityAwareValue / remPreferences.rootFontSize,
                this.precision + remPrecisionAddition
            ).toStyleValue()}rem`;
        }
        return `${new Scalar(densityAwareValue, this.precision).toStyleValue()}px`;
    }
}
