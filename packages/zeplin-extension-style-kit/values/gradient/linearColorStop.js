import Color from "../color";
import Percent from "../percent";

class LinearColorStop {
    /**
     * LinearColorStop constructor
     *
     * @param {object} colorStopObject Color stop object, with color stop color and position
     */
    // eslint-disable-next-line max-params
    constructor(colorStopObject) {
        const { color, position } = colorStopObject;
        this.color = color;
        this.position = position;
    }

    valueOf() {
        const { position, color: { r, g, b, a = 1 } } = this;

        return `linearColorStop::p:${position}:r:${r}:g:${g}:b:${b}:a:${a}`;
    }

    equals(other) {
        return this.position === other.position && this.color.equals(other.color);
    }

    toStyleValue({ colorFormat }, colorNameResolver) {
        const { position, color } = this;

        const stopColor = new Color(color).toStyleValue({ colorFormat }, colorNameResolver);

        if (!position || position === 1) {
            return stopColor;
        }

        return `${stopColor} ${new Percent(position).toStyleValue()}`;
    }
}

export default LinearColorStop;
