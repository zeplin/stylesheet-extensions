import { ColorNameResolver, StyleDeclaration, StyleFunction, StyleParams } from "../common";
import { STYLE_PROPS } from "../constants";

export class Transform implements StyleDeclaration {
    private transforms: StyleFunction[];

    constructor(transforms: StyleFunction[]) {
        this.transforms = transforms;
    }

    get name(): string {
        return STYLE_PROPS.TRANSFORM;
    }

    equals(other: Transform): boolean {
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

    getValue(params: StyleParams, colorNameResolver: ColorNameResolver): string {
        return this.transforms.map(
            ({ fn, args }) => `${fn}(${
                args.map(arg => arg.toStyleValue(params, colorNameResolver)).join(" ")
            })`
        ).join(" ");
    }
}
