import { STYLE_PROPS } from "../constants";

class BackdropFilter {
    constructor(filters) {
        this.filters = filters;
    }

    get name() {
        return STYLE_PROPS.BACKDROP_FILTER;
    }

    equals(other) {
        return (
            this.filters.length === other.filters.length &&
            this.filters.every(filter => {
                const f = other.filters.find(fx => fx === filter);

                return f && f.args.join(", ") === filter.args.join(", ");
            })
        );
    }

    getValue() {
        return this.filters.map(({ fn, args }) => `${fn}(${args.join(", ")})`).join(" ");
    }
}

export default BackdropFilter;