const HUNDRED = 100;

class Percent {
    constructor(value) {
        this.value = value;
    }

    valueOf() {
        const { value } = this;

        return `percent::v:${value}`;
    }

    equals(other) {
        return this.value === other.value;
    }

    toStyleValue() {
        const { value } = this;

        return value > 0 ? `${Math.round(value * HUNDRED)}%` : "0";
    }
}

export default Percent;