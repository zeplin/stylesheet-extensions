import { ColorNameResolver, StyleDeclaration, StyleFunction, StyleParams } from "../common";
import { STYLE_PROPS } from "../constants";

export class Filter implements StyleDeclaration {
    private filters: StyleFunction[];

    constructor(filters: StyleFunction[]) {
        this.filters = filters;
    }

    get name(): string {
        return STYLE_PROPS.FILTER;
    }

    equals(other: Filter): boolean {
        return (
            this.filters.length === other.filters.length &&
            this.filters.every((filter, index) => {
                const f = other.filters[index];

                return (
                    f.args.length === filter.args.length &&
                    filter.args.every((a, idx) => a.equals(f.args[idx]))
                );
            })
        );
    }

    getValue(params: StyleParams, colorNameResolver: ColorNameResolver): string {
        return this.filters.map(
            ({ fn, args }) => `${fn}(${args.map(arg => arg.toStyleValue(params, colorNameResolver)).join(" ")})`
        ).join(" ");
    }
}
