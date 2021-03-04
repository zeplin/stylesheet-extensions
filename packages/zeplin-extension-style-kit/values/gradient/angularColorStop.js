import Angle from "../angle";
import Color from "../color";

class AngularColorStop {
    constructor(colorStopObject) {
        const { color, position } = colorStopObject;
        this.color = color;
        this.position = position;
    }

    valueOf() {
        const { position, color: { r, g, b, a = 1 } } = this;

        return `angularColorStop::p:${position}:r:${r}:g:${g}:b:${b}:a:${a}`;
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

        return `${stopColor} ${new Angle(position, "turn").toStyleValue()}`;
    }
}

export default AngularColorStop;
