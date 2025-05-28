import { ColorStop } from "@zeplin/extension-model";
import { ColorNameResolver, ColorParams, StyleValue } from "../../common";
import { Percent } from "../percent";
import { LinearColorStop } from "./linearColorStop";

interface Point {
    x: number;
    y: number;
}

export class RadialGradient implements StyleValue {
    center: Point;
    colorStops: LinearColorStop[];

    constructor(
        colorStops: ColorStop[],
        from: Point,
        to: Point,
        width: number,
        height: number
    ) {
        this.center = from;

        /*
         * Convert the relative `from` and `to` positions on a layer to absolute positions
         * by multiplying them with the width and height of the layer
         */
        const x1 = from.x * width;
        const y1 = from.y * height;
        const x2 = to.x * width;
        const y2 = to.y * height;

        // The length of the gradient line between `from` (center) and `to` points
        const gradientDistance = Math.hypot(x1 - x2, y1 - y2);

        let farthestDistance = 0;
        const corners = [
            { x: 0, y: 0 },
            { x: width, y: 0 },
            { x: width, y: height },
            { x: 0, y: height }
        ];

        corners.forEach(corner => {
            const distance = Math.hypot(x1 - corner.x, y1 - corner.y);
            if (distance > farthestDistance) {
                farthestDistance = distance;
            }
        });

        const distanceRatio = gradientDistance / farthestDistance;

        this.colorStops = colorStops.map(({ color, position: p }) => {
            // Convert the position coming from design tool to position on the actual gradient line
            const position = p * distanceRatio;
            return new LinearColorStop({ color, position });
        });
    }


    valueOf(): string {
        const { center, colorStops } = this;

        return `radialGradient::cx:${center.x}:cy:${center.y}:${colorStops.map(cs => cs.valueOf()).join(":")}`;
    }

    equals(other: RadialGradient): boolean {
        return (
            this.center.x === other.center.x &&
            this.center.y === other.center.y &&
            this.colorStops.length === other.colorStops.length &&
            this.colorStops.every((stop, i) => stop.equals(other.colorStops[i]))
        );
    }

    toStyleValue({ colorFormat }: ColorParams, colorNameResolver: ColorNameResolver) {
        const { center, colorStops } = this;

        const colorStopStyle = colorStops.map(cs => cs.toStyleValue({ colorFormat }, colorNameResolver)).join(", ");

        return `radial-gradient(circle at ${new Percent(center.x).toStyleValue()} ${new Percent(center.y).toStyleValue()}, ${colorStopStyle})`;
    }
}
