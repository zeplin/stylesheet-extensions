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
            this.transforms.length === other.transforms.length &&
            this.transforms.every(filter => {
                const f = other.transforms.find(fx => fx.fn === filter.fn);

                return (
                    f && f.args.length === filter.args.length &&
                    filter.args.every((a, idx) => a.equals(f.args[idx]))
                );
            })
        );
    }

    getValue(params, variables) {
        return this.transforms.map(({ fn, args }) => `${fn}(${args.map(arg => arg.toStyleValue(params, variables)).join(" ")})`).join(" ");
    }
}

export default Transform;