import Scalar from "./scalar";

const remPrecisionAddition = 2;
class Length {
    static toFourDirectionLengths({ top, right, bottom, left }, options) {
        return {
            top: new Length(top, options),
            right: new Length(right, options),
            bottom: new Length(bottom, options),
            left: new Length(left, options)
        };
    }

    static toStyleFourDirectionLengths({ top, right, bottom, left }, params) {
        if (top.equals(bottom) && right.equals(left) && top.equals(right)) {
            return top.toStyleValue(params);
        }

        if (top.equals(bottom) && right.equals(left)) {
            return `${top.toStyleValue(params)} ${right.toStyleValue(params)}`;
        }

        if (right.equals(left)) {
            return `${top.toStyleValue(params)} ${right.toStyleValue(params)} ${bottom.toStyleValue(params)}`;
        }

        return `${top.toStyleValue(params)} ${right.toStyleValue(params)} ${bottom.toStyleValue(params)} ${left.toStyleValue(params)}`;
    }

    static doFourDirectionLengthsEqual(one, other) {
        return one.top.equals(other.top) &&
        one.right.equals(other.right) &&
        one.bottom.equals(other.bottom) &&
        one.left.equals(other.left);
    }

    constructor(value, { precision = 1, useDensityDivisor = true, useRemUnit = false } = {}) {
        this.value = value;
        this.precision = precision;
        this.useDensityDivisor = useDensityDivisor;
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
        const densityAwareValue = this.useDensityDivisor ? this.value / densityDivisor : this.value;
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
