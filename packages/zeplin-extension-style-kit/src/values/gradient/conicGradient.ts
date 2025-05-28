import { Angle } from "../angle";
import { AngularColorStop } from "./angularColorStop";
import { ColorStop } from "@zeplin/extension-model";
import { ColorNameResolver, ColorParams, StyleValue } from "../../common";

/**
 * In math and design tools 0deg corresponds to the angle in east
 * whereas in CSS it is the angle in north.
 */
const CSS_ANGLE_DIFFERENCE = 0.25;


export class ConicGradient implements StyleValue {
    from: number;
    colorStops: AngularColorStop[];
    center: { x: number; y: number } = { x: 0, y: 0 };
    angle?: Angle;

    constructor(colorStops: ColorStop[]) {
        const sortedColorStops = [...colorStops].sort(({ position: a }, { position: b }) => a - b);

        const firstPosition = sortedColorStops[0].position;
        this.from = firstPosition + CSS_ANGLE_DIFFERENCE;

        this.colorStops = sortedColorStops.map(({ color, position }) =>
            new AngularColorStop({ color, position: position - firstPosition })
        );

        if (sortedColorStops[sortedColorStops.length - 1].position !== 1) {
            this.colorStops.push(
                new AngularColorStop({
                    position: 1,
                    color: sortedColorStops[0].color
                })
            );
        }
    }

    valueOf() {
        const { center, colorStops } = this;

        return `conicGradient::cx:${center.x}:cy:${center.y}:${colorStops.map(cs => cs.valueOf()).join(":")}`;
    }

    equals(other: ConicGradient) {
        return (
            this.center.x === other.center.x &&
            this.center.y === other.center.y &&
            this.colorStops.length === other.colorStops.length &&
            this.colorStops.every((cs, index) => cs.equals(other.colorStops[index]))
        );
    }

    toStyleValue({ colorFormat }: ColorParams, colorNameResolver: ColorNameResolver) {
        const { from, colorStops } = this;

        const colorStopStyle = colorStops.map(cs => cs.toStyleValue({ colorFormat }, colorNameResolver)).join(", ");

        return `conic-gradient(from ${new Angle(from, "turn").toStyleValue()}, ${colorStopStyle})`;
    }
}

