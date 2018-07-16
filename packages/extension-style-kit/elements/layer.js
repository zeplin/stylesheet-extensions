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
import Mixin from "../props/mixin";
import TextStyle from "./textStyle";
import RuleSet from "../ruleSet";
import {
    blendColors,
    isPropInherited,
    selectorize,
    webkit,
    isHtmlTag
} from "../utils";

class Layer {
    constructor(layerObject, { showDimensions, showDefaultValues, useMixin } = {}) {
        this.object = layerObject;
        this.showDimensions = showDimensions;
        this.showDefaultValues = showDefaultValues;
        this.useMixin = useMixin;

        this.props = this.collectProps();
        this.children = this.populateChildren();
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
        const { object: layer, props, showDefaultValues } = this;
        let textStyleProps = new TextStyle(textStyle, { parentProps: props, showDefaultValues }).props;

        if (layer.fills.length) {
            textStyleProps = textStyleProps.filter(prop => !(prop instanceof Color));

            if (this.hasGradient) {
                textStyleProps.push(new BgClip("text"));
                textStyleProps.push(new webkit(BgClip)("text")); // eslint-disable-line
                textStyleProps.push(new webkit(TextFillColor)("transparent")); // eslint-disable-line

                const bgImages = layer.fills.map(function (fill) {
                    return Layer.fillToGradient(fill);
                });

                if (textStyle.color) {
                    bgImages.push(new Color(textStyle.color).toGradient());
                }

                textStyleProps.push(new BgImage(bgImages));
            } else {
                var blentColor = blendColors(layer.fills.map(function (fill) {
                    return fill.color;
                }));

                if (textStyle.color) {
                    blentColor = blentColor.blend(textStyle.color);
                }

                textStyleProps.push(new Color(blentColor));
            }
        }

        return textStyleProps;
    }

    getUniqueTextStyles() {
        const uniqueTextStyles = [];

        this.object.textStyles.forEach(({ textStyle }) => {
            const found = uniqueTextStyles.some(function (ts) {
                return textStyle.equals(ts);
            });

            if (found) {
                return;
            }

            uniqueTextStyles.push(textStyle);
        });

        return uniqueTextStyles;
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
                } else if (this.blentColor) {
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

    get blentColor() {
        if (!this.hasFill) {
            return;
        }

        if (!this.hasGradient && !this.hasBlendMode) {
            return new Color(blendColors(this.object.fills.map(function (fill) {
                return fill.color;
            })));
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
                new webkit(TextStroke)(new Length(thickness), new Color(fill.color))
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

    /* eslint-disable complexity */
    collectProps() {
        const {
            bgImages,
            blentColor,
            elementBorder,
            object: layer,
            showDimensions,
            useMixin
        } = this;
        let props = showDimensions ? [
            new Width(new Length(layer.rect.width)),
            new Height(new Length(layer.rect.width))
        ] : [];

        if (layer.exportable) {
            props.push(new ObjectFit("contain"));
        }

        if (layer.rotation) {
            props.push(new Transform([{ fn: "rotate", args: [`${-layer.rotation}deg`] }]));
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

        if (layer.fills.length && this.hasBlendMode) {
            props.push(new BgBlendMode(layer.fills.map(fill => fill.blendMode)));
        }

        if (elementBorder) {
            props = props.concat(this.generateBorderProps());
        }

        if (bgImages) {
            props.push(new BgImage(bgImages));
        } else if (blentColor) {
            props.push(new BgColor(blentColor));
        }

        const { defaultTextStyle } = layer;

        if (layer.type === "text" && defaultTextStyle) {
            if (useMixin) {
                const { name: textStyleName } = defaultTextStyle;

                if (textStyleName && !isHtmlTag(selectorize(textStyleName))) {
                    props.push(new Mixin(selectorize(textStyleName)));
                } else {
                    props = props.concat(this.getLayerTextStyleProps(defaultTextStyle));
                }
            } else {
                props = props.concat(this.getLayerTextStyleProps(defaultTextStyle));
            }
        }

        return props;
    }

    shouldIncludeProp(childProp, showDefault) {
        const layerProp = this.props.find(p => p.name === childProp.name);

        if (!layerProp || !layerProp.equals(childProp)) {
            return true;
        }

        return childProp.hasDefaultValue() && showDefault === true;
    }

    filterChildProps(childProps) {
        const { showDefaultValues, props } = this;

        return childProps.filter(prop => {
            if (showDefaultValues && prop.hasDefaultValue()) {
                return true;
            }

            const parentProp = props.find(p => p.name === prop.name);

            if (parentProp) {
                if (!parentProp.equals(prop)) {
                    return true;
                }

                return !isPropInherited(prop.name);
            }

            if (!showDefaultValues && prop.hasDefaultValue()) {
                return false;
            }

            return true;
        });
    }

    populateChildren() {
        const { defaultTextStyle, name } = this.object;

        if (this.object.type === "text" && defaultTextStyle) {
            return this.getUniqueTextStyles().filter(
                textStyle => !defaultTextStyle.equals(textStyle)
            ).map(
                (textStyle, idx) => new RuleSet(`${selectorize(name)} ${selectorize(`text-style-${idx + 1}`)}`, this.filterChildProps(this.getLayerTextStyleProps(textStyle)))
            );
        }

        return [];
    }

    get style() {
        return new RuleSet(selectorize(this.object.name), this.props);
    }

    get childrenStyles() {
        return this.children;
    }
}

export default Layer;