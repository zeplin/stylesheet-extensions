import LinearColorStop from "./linearColorStop";
import Percent from "../percent";

class RadialGradient {
    // eslint-disable-next-line max-params
    constructor(colorStops, from, to, width, height) {
        this.center = from;

        const x1 = from.x * width;
        const y1 = from.y * height;
        const x2 = to.x * width;
        const y2 = to.y * height;

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

        this.colorStops = colorStops.map(cs => new LinearColorStop(cs, 0, gradientDistance, 0, farthestDistance));
    }

    valueOf() {
        const { center, colorStops } = this;

        return `radialGradient::cx:${center.x}:cy:${center.y}:${colorStops.map(cs => cs.valueOf()).join(":")}`;
    }

    equals(other) {
        return (
            this.center.x === other.center.x &&
            this.center.y === other.center.y &&
            this.colorStops.length === other.colorStops.length &&
            this.colorStops.every((cs, index) => cs.equals(other.colorStops[index]))
        );
    }

    toStyleValue({ colorFormat }, variables) {
        const { center, colorStops } = this;

        const colorStopStyle = colorStops.map(cs => cs.toStyleValue({ colorFormat }, variables)).join(", ");

        return `radial-gradient(circle at ${new Percent(center.x).toStyleValue()} ${new Percent(center.y).toStyleValue()}, ${colorStopStyle})`;
    }
}

export default RadialGradient;
