import Angle from "../values/angle";
import Color from "../values/color";
import Gradient from "../values/gradient";
import Length from "../values/length";
import Scalar from "../values/scalar";
import Border from "../props/border";
import Shadow from "../props/shadow";
import Opacity from "../props/opacity";
import Width from "../props/width";
import Height from "../props/height";
import ObjectFit from "../props/objectFit";
import Transform from "../props/transform";
import MixBlendMode from "../props/mixBlendMode";
import BorderRadius from "../props/borderRadius";
import BgBlendMode from "../props/bgBlendMode";
import BgImage from "../props/bgImage";
import BgColor from "../props/bgColor";
import BgClip from "../props/bgClip";
import TextFillColor from "../props/textFillColor";
import TextStroke from "../props/textStroke";
import BorderImageSource from "../props/borderImageSource";
import BorderWidth from "../props/borderWidth";
import BorderStyle from "../props/borderStyle";
import BorderImageSlice from "../props/borderImageSlice";
import BackdropFilter from "../props/backdropFilter";
import Filter from "../props/Filter";
import TextStyle from "./textStyle";
import RuleSet from "../ruleSet";
import {
    blendColors,
    selectorize,
    webkit
} from "../utils";

class Layer {
    constructor(layerObject = {}) {
        this.object = layerObject;

        this.props = this.collectProps();
    }

    static fillToGradient(fill) {
        return fill.type === "color" ? new Color(fill.color).toGradient() : new Gradient(fill.gradient);
    }

    get hasBlendMode() {
        return this.object.fills.some(function (f) {
            return f.blendMode && f.blendMode !== "normal";
        });
    }

    get hasGradient() {
        return this.object.fills.some(function (f) {
            return f.type === "gradient";
        });
    }

    get hasFill() {
        return this.object.fills.length > 0;
    }

    getLayerTextStyleProps(textStyle) {
        const { object: layer } = this;
        let textStyleProps = new TextStyle(textStyle).props;

        if (layer.fills.length) {
            textStyleProps = textStyleProps.filter(prop => !(prop instanceof Color));

            if (this.hasGradient) {
                textStyleProps.push(new BgClip("text"));
                textStyleProps.push(new webkit(BgClip)("text"));
                textStyleProps.push(new TextFillColor("transparent"));

                const bgImages = layer.fills.map(function (fill) {
                    return Layer.fillToGradient(fill);
                });

                if (textStyle.color) {
                    bgImages.push(new Color(textStyle.color).toGradient());
                }

                textStyleProps.push(new BgImage(bgImages));
            } else {
                let blentColor = blendColors(layer.fills.map(fill => fill.color));

                if (textStyle.color) {
                    blentColor = blentColor.blend(textStyle.color);
                }

                textStyleProps.push(new Color(blentColor));
            }
        }

        return textStyleProps;
    }

    get elementBorder() {
        const { object: layer } = this;

        return layer.borders.length ? layer.borders[layer.borders.length - 1] : null;
    }

    get bgImages() {
        let bgImages;

        if (!this.hasFill) {
            return;
        }

        if (this.hasGradient || this.hasBlendMode) {
            bgImages = this.object.fills.map(fill => Layer.fillToGradient(fill));
        }

        if (this.elementBorder) {
            if (this.object.borderRadius && this.elementBorder.fill.type === "gradient") {
                const borderFill = new Gradient(this.elementBorder.fill.gradient);

                if (bgImages) {
                    bgImages.push(borderFill);
                } else if (this.fillColor) {
                    bgImages = [bgImages, borderFill];
                } else {
                    /*
                        * Actually the background should be transparent if there are no fills,
                        * i.e. what's on the background of this layer should be shown.
                        * But we have no way of knowing the background of parent layer,
                        * and making it transparent will make fake-gradient-border background visible.
                        */
                    const white = Color.fromRGBA({
                        r: 255,
                        g: 255,
                        b: 255,
                        a: 1
                    });

                    bgImages = [white.toGradient(), borderFill];
                }
            }
        }

        return bgImages;
    }

    get fillColor() {
        if (!this.hasFill) {
            return;
        }

        if (!this.hasGradient && !this.hasBlendMode) {
            return new Color(blendColors(this.object.fills.map(fill => fill.color)));
        }
    }

    generateBorderProps() {
        const {
            elementBorder: {
                fill,
                thickness
            },
            object: layer
        } = this;

        if (layer.type === "text" && fill.type === "color") {
            return [
                new TextStroke(new Length(thickness), new Color(fill.color))
            ];
        }

        switch (fill.type) {
            case "color":
                return [
                    new Border({
                        style: "solid",
                        width: new Length(thickness),
                        color: new Color(fill.color)
                    })
                ];

            case "gradient": {
                return [
                    new BorderStyle("solid"),
                    new BorderWidth(new Length(thickness)),
                    new BorderImageSource(new Gradient(fill.gradient)),
                    new BorderImageSlice(new Scalar(1))
                ];
            }

            default:
                return [];
        }
    }

    generateBlurProps() {
        const { blur } = this.object;
        const filterFns = [{ fn: "blur", args: [new Length(blur.radius)] }];

        if (blur.type === "background") {
            return [
                new (webkit(BackdropFilter))(filterFns),
                new BackdropFilter(filterFns)
            ];
        }

        return [
            new (webkit(Filter))(filterFns),
            new Filter(filterFns)
        ];
    }

    generateBackgroundProps() {
        const { bgImages, fillColor, object: layer } = this;
        const props = [];

        if (this.hasFill && this.hasBlendMode) {
            props.push(new BgBlendMode(layer.fills.map(fill => fill.blendMode)));
        }

        if (bgImages) {
            props.push(new BgImage(bgImages));
        } else if (fillColor) {
            props.push(new BgColor(fillColor));
        }

        return props;
    }

    /* eslint-disable complexity */
    collectProps() {
        const {
            elementBorder,
            object: layer
        } = this;
        let props = [
            new Width(new Length(layer.rect.width)),
            new Height(new Length(layer.rect.width))
        ];

        if (layer.exportable) {
            props.push(new ObjectFit("contain"));
        }

        if (layer.rotation) {
            props.push(new Transform([{ fn: "rotate", args: [new Angle(-layer.rotation)] }]));
        }

        if (layer.opacity !== 1) {
            props.push(new Opacity(new Scalar(layer.opacity)));
        }

        if (layer.blendMode !== "normal") {
            props.push(new MixBlendMode(layer.blendMode));
        }

        if (layer.borderRadius) {
            // TODO: different radii for each corner?
            props.push(new BorderRadius(new Length(layer.borderRadius)));
        }

        if (layer.blur && layer.blur.radius) {
            props = props.concat(this.generateBlurProps());
        }

        if (layer.shadows.length) {
            props.push(new Shadow(layer.shadows, layer.type === "text" ? Shadow.TEXT : Shadow.BOX));
        }

        if (elementBorder) {
            props = props.concat(this.generateBorderProps());
        }

        props = props.concat(this.generateBackgroundProps());

        return props;
    }

    get style() {
        return new RuleSet(selectorize(this.object.name), this.props);
    }
}

export default Layer;