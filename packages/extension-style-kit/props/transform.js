import { STYLE_PROPS } from "../constants";

class Transform {
    constructor(transforms) {
        this.transforms = transforms;
    }

    get name() {
        return STYLE_PROPS.TRANSFORM;
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
        return this.transforms.map(({ fn, args }) => `${fn}(${args.join(", ")})`).join(", ");
    }
}

export default Transform;