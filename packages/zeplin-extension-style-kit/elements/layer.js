import Angle from "../values/angle";
import Color from "../values/color";
import Gradient from "../values/gradient";
import Length from "../values/length";
import Scalar from "../values/scalar";
import Border from "../declarations/border";
import Shadow from "../declarations/shadow";
import Opacity from "../declarations/opacity";
import Width from "../declarations/width";
import Height from "../declarations/height";
import ObjectFit from "../declarations/objectFit";
import Transform from "../declarations/transform";
import MixBlendMode from "../declarations/mixBlendMode";
import BorderRadius from "../declarations/borderRadius";
import BackgroundBlendMode from "../declarations/backgroundBlendMode";
import BackgroundImage from "../declarations/backgroundImage";
import BackgroundColor from "../declarations/backgroundColor";
import BackgroundClip from "../declarations/backgroundClip";
import BackgroundOrigin from "../declarations/backgroundOrigin";
import TextFillColor from "../declarations/textFillColor";
import TextStroke from "../declarations/textStroke";
import BorderImageSource from "../declarations/borderImageSource";
import BorderWidth from "../declarations/borderWidth";
import BorderStyle from "../declarations/borderStyle";
import BorderImageSlice from "../declarations/borderImageSlice";
import BackdropFilter from "../declarations/backdropFilter";
import Filter from "../declarations/filter";
import FontColor from "../declarations/fontColor";
import Margin from "../declarations/margin";
import Padding from "../declarations/padding";
import TextStyle from "./textStyle";
import RuleSet from "../ruleSet";
import {
    blendColors,
    selectorize,
    webkit
} from "../utils";
import { Bound } from "./utility/bound";

const useRemUnitForMeasurement = ({ useForMeasurements }) => useForMeasurements;

class Layer {
    constructor(layerObject = {}) {
        this.object = layerObject;

        this.declarations = this.collectDeclarations();
    }

    static fillToGradient(fill, width, height) {
        return fill.type === "color" ? new Color(fill.color).toGradient() : new Gradient(fill.gradient, width, height);
    }

    get hasBlendMode() {
        return this.object.fills.some(f => f.blendMode && f.blendMode !== "normal");
    }

    get hasGradient() {
        return this.object.fills.some(f => f.type === "gradient");
    }

    get hasFill() {
        return this.object.fills.length > 0;
    }

    getLayerTextStyleDeclarations(textStyle) {
        const { object: layer } = this;
        let declarations = new TextStyle(textStyle).declarations;

        if (layer.fills.length) {
            declarations = declarations.filter(declaration => !(declaration instanceof Color));

            if (this.hasGradient) {
                declarations.push(new (webkit(BackgroundClip))(["text"]));
                declarations.push(new BackgroundClip(["text"]));
                declarations.push(new TextFillColor("transparent"));

                const bgImages = layer.fills.map(fill =>
                    Layer.fillToGradient(fill, layer.rect.width, layer.rect.height)
                );

                if (textStyle.color) {
                    bgImages.push(new Color(textStyle.color).toGradient());
                }

                declarations.push(new BackgroundImage(bgImages));
            } else {
                let blentColor = blendColors(layer.fills.map(fill => fill.color));

                if (textStyle.color) {
                    blentColor = blentColor.blend(textStyle.color);
                }

                declarations.push(new FontColor(new Color(blentColor)));
            }
        }

        return declarations;
    }

    get elementBorder() {
        const { object: { borders } } = this;

        return borders.length ? borders[borders.length - 1] : null;
    }

    get backgroundImages() {
        let bgImages;

        if (!this.hasFill) {
            return null;
        }

        if (this.hasGradient || this.hasBlendMode) {
            bgImages = this.object.fills.map(fill =>
                Layer.fillToGradient(fill, this.object.rect.width, this.object.rect.height)
            );
        }

        if (this.elementBorder) {
            if (this.object.borderRadius && this.elementBorder.fill.type === "gradient") {
                const borderFill = new Gradient(
                    this.elementBorder.fill.gradient,
                    this.object.rect.width,
                    this.object.rect.height
                );

                if (bgImages) {
                    bgImages.push(borderFill);
                } else if (this.fillColor) {
                    bgImages = [this.fillColor.toGradient(), borderFill];
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
        if (this.hasFill && !this.hasGradient && !this.hasBlendMode) {
            return new Color(blendColors(this.object.fills.map(fill => fill.color)));
        }

        return null;
    }

    generateBorderDeclarations() {
        const {
            elementBorder: {
                fill,
                thickness
            },
            object: layer
        } = this;

        if (layer.type === "text" && fill.type === "color") {
            return [
                new (webkit(TextStroke))(new Length(thickness), new Color(fill.color))
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
                    new BorderImageSource(new Gradient(fill.gradient, layer.rect.width, layer.rect.height)),
                    new BorderImageSlice(new Scalar(1))
                ];
            }

            default:
                return [];
        }
    }

    generateBlurDeclarations() {
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

    generateBackgroundDeclarations() {
        const { backgroundImages, elementBorder, fillColor, object: layer } = this;
        const declarations = [];

        if (this.hasFill && this.hasBlendMode) {
            declarations.push(new BackgroundBlendMode(layer.fills.map(fill => fill.blendMode)));
        }

        if (backgroundImages) {
            declarations.push(new BackgroundImage(backgroundImages));

            if (layer.borderRadius && elementBorder && elementBorder.fill.type === "gradient") {
                declarations.push(new BackgroundOrigin(["border-box"]));
                declarations.push(new BackgroundClip([...Array(backgroundImages.length - 1).fill("content-box"), "border-box"]));
            }
        } else if (fillColor) {
            declarations.push(new BackgroundColor(fillColor));
        }

        return declarations;
    }

    /* eslint-disable complexity */
    collectDeclarations() {
        const {
            elementBorder,
            object: layer
        } = this;
        let declarations = [
            new Width(new Length(layer.rect.width, { useRemUnit: useRemUnitForMeasurement })),
            new Height(new Length(layer.rect.height, { useRemUnit: useRemUnitForMeasurement }))
        ];

        const { margin, padding } = Bound.layerToBound(layer) || {};
        if (margin && !margin.equals(Margin.Zero)) {
            declarations.push(margin);
        }
        if (padding && !padding.equals(Padding.Zero)) {
            declarations.push(padding);
        }

        if (layer.exportable) {
            declarations.push(new ObjectFit("contain"));
        }

        if (layer.rotation) {
            declarations.push(new Transform([{ fn: "rotate", args: [new Angle(-layer.rotation)] }]));
        }

        if (layer.opacity !== 1) {
            declarations.push(new Opacity(new Scalar(layer.opacity)));
        }

        if (layer.blendMode !== "normal") {
            declarations.push(new MixBlendMode(layer.blendMode));
        }

        if (layer.borderRadius) {
            // TODO: different radii for each corner?
            declarations.push(new BorderRadius(new Length(layer.borderRadius)));
        }

        if (layer.blur && layer.blur.radius) {
            declarations = declarations.concat(this.generateBlurDeclarations());
        }

        if (layer.shadows.length) {
            declarations.push(new Shadow(layer.shadows, layer.type === "text" ? Shadow.TYPES.TEXT : Shadow.TYPES.BOX));
        }

        if (elementBorder) {
            declarations = declarations.concat(this.generateBorderDeclarations());
        }

        declarations = declarations.concat(this.generateBackgroundDeclarations());

        return declarations;
    }

    get style() {
        return new RuleSet(selectorize(this.object.name), this.declarations);
    }
}

export default Layer;
