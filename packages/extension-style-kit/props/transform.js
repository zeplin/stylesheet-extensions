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
            this.transforms.every((fn, index) => {
                const f = other.transforms[index];

                return (
                    f.args.length === fn.args.length &&
                    fn.args.every((a, idx) => a.equals(f.args[idx]))
                );
            })
        );
    }

    getValue(params, variables) {
        return this.transforms.map(({ fn, args }) => `${fn}(${args.map(arg => arg.toStyleValue(params, variables)).join(" ")})`).join(" ");
    }
}

export default Transform;