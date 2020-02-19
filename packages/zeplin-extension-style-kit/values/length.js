import Scalar from "./scalar";

const remPrecisionAddition = 2;
class Length {
    constructor(value, { precision = 1, canUseRemUnit } = {}) {
        this.value = value;
        this.precision = precision;
        this.canUseRemUnit = canUseRemUnit;
    }

    valueOf() {
        const { value, unit } = this;

        return `length::v:${value}:u:${unit}`;
    }

    equals(other) {
        return this.value === other.value;
    }

    toStyleValue({ densityDivisor, useRemUnit, rootFontSize }) {
        if (this.value === 0) {
            return "0";
        }
        const densityAwareValue = this.value / densityDivisor;
        if (this.canUseRemUnit && useRemUnit) {
            return `${
                new Scalar(
                    densityAwareValue / rootFontSize,
                    this.precision + remPrecisionAddition
                ).toStyleValue()}rem`;
        }
        return `${new Scalar(densityAwareValue, this.precision).toStyleValue()}px`;
    }
}

export default Length;
