import Scalar from "./scalar";

const remPrecisionAddition = 2;
class Length {
    constructor(value, { precision = 1, useRemUnit = false } = {}) {
        this.value = value;
        this.precision = precision;
        this.useRemUnit = remPreferences => {
            if (!remPreferences || !remPreferences.rootFontSize) {
                return false;
            }
            return useRemUnit instanceof Function ? useRemUnit(remPreferences) : useRemUnit;
        };
    }

    valueOf() {
        const { value, unit } = this;

        return `length::v:${value}:u:${unit}`;
    }

    equals(other) {
        return this.value === other.value;
    }

    toStyleValue({ densityDivisor, remPreferences }) {
        if (this.value === 0) {
            return "0";
        }
        const densityAwareValue = this.value / densityDivisor;
        if (this.useRemUnit(remPreferences)) {
            return `${
                new Scalar(
                    densityAwareValue / remPreferences.rootFontSize,
                    this.precision + remPrecisionAddition
                ).toStyleValue()}rem`;
        }
        return `${new Scalar(densityAwareValue, this.precision).toStyleValue()}px`;
    }
}

export default Length;
