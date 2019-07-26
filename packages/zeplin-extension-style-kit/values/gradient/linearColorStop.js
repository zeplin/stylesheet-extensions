import Color from "../color";
import Percent from "../percent";

class LinearColorStop {
    /**
     * LinearColorStop constructor
     *
     * @param {object} colorStopObject Color stop object, with color and relative position of the color stop in the range of [pFirst, pLast]
     * @param {number} pFirst First color stop position
     * @param {number} pLast Last color stop position
     * @param {number} pStart Start of the gradient line
     * @param {number} pEnd End of the gradient line
     */
    // eslint-disable-next-line max-params
    constructor(colorStopObject, pFirst, pLast, pStart, pEnd) {
        const { color, position } = colorStopObject;
        this.color = color;
        this.position = (position * (pLast - pFirst) + pFirst - pStart) / (pEnd - pStart);
    }

    valueOf() {
        const { position, color: { r, g, b, a = 1 } } = this;

        return `linearColorStop::p:${position}:r:${r}:g:${g}:b:${b}:a:${a}`;
    }

    equals(other) {
        return this.position === other.position && this.color.equals(other.color);
    }

    toStyleValue({ colorFormat }, variables) {
        const { position, color } = this;

        const stopColor = new Color(color).toStyleValue({ colorFormat }, variables);

        if (!position || position === 1) {
            return stopColor;
        }

        return `${stopColor} ${new Percent(position).toStyleValue()}`;
    }
}

export default LinearColorStop;
