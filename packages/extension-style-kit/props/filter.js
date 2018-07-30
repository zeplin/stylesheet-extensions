import { STYLE_PROPS } from "../constants";

class Filter {
    constructor(filters) {
        this.filters = filters;
    }

    get name() {
        return STYLE_PROPS.FILTER;
    }

    equals(other) {
        return (
            this.filters.length === other.filters.length &&
            this.filters.every(filter => {
                const f = other.filters.find(fx => fx.fn === filter.fn);

                return (
                    f && f.args.length === filter.args.length &&
                    filter.args.every((a, idx) => a.equals(f.args[idx]))
                );
            })
        );
    }

    getValue(params, variables) {
        return this.filters.map(({ fn, args }) => `${fn}(${args.map(arg => arg.toStyleValue(params, variables)).join(" ")})`).join(" ");
    }
}

export default Filter;