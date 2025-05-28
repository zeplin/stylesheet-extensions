import { ColorStop } from "@zeplin/extension-model";
import { ColorNameResolver, ColorParams, StyleValue } from "../../common";
import { LinearColorStop } from "./linearColorStop";

interface Point {
    x: number;
    y: number;
}

export class LinearGradient implements StyleValue {
    angle: number;
    colorStops: LinearColorStop[];

    constructor(
        colorStops: ColorStop[],
        from: Point,
        to: Point,
        width: number,
        height: number
    ) {
        /*
         * Convert the relative `from` and `to` positions on a layer to absolute positions
         * by multiplying them with the width and height of the layer
         */
        const x1 = from.x * width;
        const y1 = from.y * height;
        const x2 = to.x * width;
        const y2 = to.y * height;

        this.angle = (360 - Math.round(Math.atan2(x1 - x2, y1 - y2) * 180 / Math.PI)) % 360;

        let pFirst: number;
        let pLast: number;
        let pStart: number;
        let pEnd: number;

        // Find the slope of the gradient line
        const m1 = (y2 - y1) / (x2 - x1);

        if (m1 === 0) {
            // If the slope is 0, gradient line is horizontal
            pFirst = x1;
            pLast = x2;
            pStart = 0;
            pEnd = width;
        } else if (!Number.isFinite(m1)) {
            // If the slope is infinite, gradient line is vertical
            pFirst = y1;
            pLast = y2;
            pStart = 0;
            pEnd = height;
        } else {
            pFirst = x1;
            pLast = x2;

            // Find c1 such that y = m1 * x + c1, by applying one of the positions
            const c1 = y1 - m1 * x1;

            // The slope of a perpendicular line
            const m2 = -1 / m1;

            // Starting and ending points
            let x0;
            let y0;
            let xe;
            let ye;

            if (m1 > 0) {
                /*
                 * If the slope is positive, starting point is top-left corner (0, 0)
                 * and ending point is bottom-right corner (w, h)
                 */
                x0 = 0;
                y0 = 0;
                xe = width;
                ye = height;
            } else {
                /*
                 * If the slope is negative, starting point is bottom-left corner (0, h)
                 * and ending point is top-right corner (w, 0)
                 */
                x0 = 0;
                y0 = height;
                xe = width;
                ye = 0;
            }

            /*
             * `c2` equation constant of the line crossing from starting point
             * and perpendicular to the gradient line
             */
            const c2 = y0 - m2 * x0;

            /*
             * `x` position of the intersection point of gradient line
             * and the perpendecular line crossing from starting point
             */
            pStart = (c2 - c1) / (m1 - m2);

            /*
             * `c3` equation constant of the line crossing from ending point
             * and perpendicular to the gradient line
             */
            const c3 = ye - m2 * xe;

            /*
             * `x` position of the intersection point of gradient line
             * and the perpendecular line crossing from ending point
             */
            pEnd = (c3 - c1) / (m1 - m2);
        }

        this.colorStops = colorStops.map(({ color, position: p }) => {
            // Convert the position coming from design tool to position on the actual gradient line
            const position = (p * (pLast - pFirst) + pFirst - pStart) / (pEnd - pStart);
            return new LinearColorStop({ color, position });
        });
    }


    valueOf(): string {
        const { angle, colorStops } = this;

        return `linearGradient::a:${angle}:${colorStops.map(cs => cs.valueOf()).join(":")}`;
    }

    equals(other: LinearGradient): boolean {
        return (
            this.angle === other.angle &&
            this.colorStops.length === other.colorStops.length &&
            this.colorStops.every((cs, index) => cs.equals(other.colorStops[index]))
        );
    }

    toCSSAngle(angle: number) {
        switch (angle) {
            case 0:
                return "to top";

            case 90:
                return "to right";

            case 180:
                return "to bottom";

            case 270:
                return "to left";

            default:
                return `${angle}deg`;
        }
    }

    toStyleValue({ colorFormat }: ColorParams, colorNameResolver: ColorNameResolver) {
        const { angle, colorStops } = this;

        const colorStopStyle = colorStops.map(cs => cs.toStyleValue({ colorFormat }, colorNameResolver)).join(", ");

        return `linear-gradient(${this.toCSSAngle(angle)}, ${colorStopStyle})`;
    }
}
