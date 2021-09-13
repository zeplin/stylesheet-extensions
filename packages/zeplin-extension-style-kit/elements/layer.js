import { Layout, Fill } from "@zeplin/extension-model";

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
import Display from "../declarations/display";
import FlexDirection from "../declarations/flexDirection";
import Gap from "../declarations/gap";
import TextStyle from "./textStyle";
import RuleSet from "../ruleSet";
import {
    blendColors,
    isHtmlTag,
    isTextRelatedTag,
    selectorize,
    webkit
} from "../utils";
import { Bound } from "./utility/bound";
import JustifyContent from "../declarations/justifyContent";
import AlignItems from "../declarations/alignItems";
import AlignSelf from "../declarations/alignSelf";
import FlexGrow from "../declarations/flexGrow";

const useRemUnitForMeasurement = ({ useForMeasurements }) => useForMeasurements;

const borderPositionShadowTypeMapper = {
    inside: "inner",
    outside: "outer"
};

const TWO = 2;

class Layer {
    constructor(layerObject = {}) {
        this.object = layerObject;

        this.declarations = this.collectDeclarations();
    }

    static fillToGradient(fill, width, height) {
        return fill.type === Fill.TYPE.COLOR
            ? new Color(fill.color).toGradient()
            : new Gradient(fill.gradient, width, height);
    }

    get hasBlendMode() {
        return this.object.fills.some(f => f.blendMode && f.blendMode !== "normal");
    }

    get hasGradient() {
        return this.object.fills.some(f => f.type === Fill.TYPE.GRADIENT);
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

    blendBorders(accumulator, current) {
        if (accumulator.fill.type === Fill.TYPE.COLOR && current.fill.type === Fill.TYPE.COLOR) {
            return {
                position: accumulator.position,
                thickness: accumulator.thickness,
                fill: {
                    type: Fill.TYPE.COLOR,
                    color: current.fill.color.blend(accumulator.fill.color)
                }
            };
        }

        if (accumulator.fill.type === Fill.TYPE.GRADIENT) {
            return {
                position: accumulator.position,
                thickness: accumulator.thickness,
                fill: Object.assign(
                    {},
                    accumulator.fill,
                    {
                        gradient: Object.assign(
                            {},
                            accumulator.fill.gradient,
                            {
                                colorStops: accumulator.fill.gradient.colorStops.map(({ position, color }) => ({
                                    position,
                                    color: current.fill.color.blend(color)
                                }))
                            }
                        )
                    }
                )
            };
        }

        return {
            position: accumulator.position,
            thickness: accumulator.thickness,
            fill: Object.assign(
                {},
                current.fill,
                {
                    gradient: Object.assign(
                        {},
                        current.fill.gradient,
                        {
                            colorStops: current.fill.gradient.colorStops.map(({ position, color }) => ({
                                position,
                                color: color.blend(accumulator.fill.color)
                            }))
                        }
                    )
                }
            )
        };
    }

    get elementBorder() {
        const { object: { borders } } = this;

        if (!this.shouldDrawBorder()) {
            return null;
        }

        if (borders.length === 1) {
            return borders[0];
        }

        return borders.reduce(this.blendBorders);
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
            if (this.object.borderRadius && this.elementBorder.fill.type === Fill.TYPE.GRADIENT) {
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

    shouldDrawBorder() {
        const {
            object: {
                borders
            }
        } = this;

        const gradientCount = borders.filter(({ fill }) => fill.type === Fill.TYPE.GRADIENT).length;

        if (gradientCount > 1 || borders.length === 0) {
            return false;
        }

        const [{ position, thickness }] = borders;

        return borders.every(border => border.position === position && border.thickness === thickness);
    }

    generateBorderDeclarations() {
        if (!this.shouldDrawBorder()) {
            return [];
        }

        const {
            elementBorder: {
                fill,
                thickness
            },
            object: layer
        } = this;

        if (layer.type === "text" && fill.type === Fill.TYPE.COLOR) {
            return [
                new (webkit(TextStroke))(new Length(thickness), new Color(fill.color))
            ];
        }

        switch (fill.type) {
            case Fill.TYPE.COLOR:
                return [
                    new Border({
                        style: "solid",
                        width: new Length(thickness),
                        color: new Color(fill.color)
                    })
                ];

            case Fill.TYPE.GRADIENT: {
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

    shouldDrawShadowFromBorder() {
        const {
            object: {
                borders
            }
        } = this;

        return !this.shouldDrawBorder() &&
            borders.length > 1 &&
            borders.every(({ fill }) => fill.type === Fill.TYPE.COLOR);
    }

    shadowOffset() {
        const {
            object: {
                borders
            }
        } = this;
        const maxThickness = Math.max(...borders.map(({ thickness }) => thickness));

        switch (borders[0].position) {
            case "outside":
                return maxThickness;
            case "center":
                return maxThickness / TWO;
            case "inside":
            default:
                return 0;
        }
    }

    generateShadowDeclarations() {
        const {
            object: {
                borders,
                shadows,
                type
            }
        } = this;

        const shouldDraw = this.shouldDrawShadowFromBorder();

        if (!shouldDraw && shadows.length) {
            return [new Shadow(shadows, type === "text" ? Shadow.TYPES.TEXT : Shadow.TYPES.BOX)];
        }

        if (!shouldDraw && shadows.length === 0) {
            return [];
        }

        const bordersWithoutCenter = borders.flatMap(border => (
            border.position === "center"
                ? [
                    Object.assign({}, border, { thickness: border.thickness / TWO, position: "inside" }),
                    Object.assign({}, border, { thickness: border.thickness / TWO, position: "outside" })
                ] : border
        ));

        const borderShadows = bordersWithoutCenter.reverse().map(({ fill: { color }, thickness, position }) => ({
            type: borderPositionShadowTypeMapper[position],
            color,
            offsetY: 0,
            offsetX: 0,
            blurRadius: 0,
            spread: thickness
        }));

        const offset = this.shadowOffset();

        return [
            new Shadow(
                [
                    ...borderShadows,
                    ...shadows.map(shadow => Object.assign(
                        {},
                        shadow,
                        { spread: shadow.spread + offset }
                    ))
                ],
                type === "text" ? Shadow.TYPES.TEXT : Shadow.TYPES.BOX
            )
        ];
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

            if (layer.borderRadius && elementBorder && elementBorder.fill.type === Fill.TYPE.GRADIENT) {
                declarations.push(new BackgroundOrigin(["border-box"]));
                declarations.push(new BackgroundClip([...Array(backgroundImages.length - 1).fill("content-box"), "border-box"]));
            }
        } else if (fillColor) {
            declarations.push(new BackgroundColor(fillColor));
        }

        return declarations;
    }

    shouldAddWidth() {
        const {
            object: {
                parent,
                layoutGrow,
                layoutAlignment
            }
        } = this;
        return !parent || !parent.layout || (
            parent.layout.direction === Layout.DIRECTION.ROW
                ? layoutGrow === 0
                : layoutAlignment !== Layout.ALIGNMENT.STRETCH
        );
    }

    shouldAddHeight() {
        const {
            object: {
                parent,
                layoutGrow,
                layoutAlignment
            }
        } = this;
        return !parent || !parent.layout || (
            parent.layout.direction === Layout.DIRECTION.COLUMN
                ? layoutGrow === 0
                : layoutAlignment !== Layout.ALIGNMENT.STRETCH
        );
    }

    addSizeToDeclaration(declarations) {
        const {
            object: {
                rect: {
                    width,
                    height
                }
            }
        } = this;

        if (this.shouldAddWidth()) {
            declarations.push(new Width(new Length(width, { useRemUnit: useRemUnitForMeasurement })));
        }

        if (this.shouldAddHeight()) {
            declarations.push(new Height(new Length(height, { useRemUnit: useRemUnitForMeasurement })));
        }
    }

    addLayoutToDeclarations(declarations) {
        const {
            object: {
                layout,
                layoutAlignment,
                layoutGrow
            }
        } = this;

        if (layoutAlignment && layoutAlignment !== Layout.ALIGNMENT.INHERIT) {
            declarations.push(new AlignSelf(layoutAlignment));
        }

        if (layoutGrow !== void 0) {
            declarations.push(new FlexGrow(new Scalar(layoutGrow)));
        }

        if (layout && layout.direction) {
            const {
                direction,
                distribution,
                itemAlignment,
                gap
            } = layout;

            declarations.push(
                Display.flex(),
                new FlexDirection(direction),
            );
            if (distribution) {
                declarations.push(new JustifyContent(distribution));
            }
            if (itemAlignment) {
                declarations.push(new AlignItems(itemAlignment));
            }
            if (gap > 0) {
                declarations.push(new Gap(new Length(gap)));
            }
        }
    }

    addPaddingMargin(declarations) {
        const {
            object: {
                layout,
                parent
            },
            object: layer
        } = this;
        const { margin, padding } = Bound.layerToBound(layer) || {};

        if (
            (!parent || !parent.layout) &&
            (margin && !margin.equals(Margin.Zero))
        ) {
            declarations.push(margin);
        }

        if (layout && layout.padding) {
            declarations.push(
                new Padding({
                    top: new Length(layout.padding.top, { useRemUnit: useRemUnitForMeasurement }),
                    right: new Length(layout.padding.right, { useRemUnit: useRemUnitForMeasurement }),
                    bottom: new Length(layout.padding.bottom, { useRemUnit: useRemUnitForMeasurement }),
                    left: new Length(layout.padding.left, { useRemUnit: useRemUnitForMeasurement })
                })
            );
        } else if (padding && !padding.equals(Padding.Zero)) {
            declarations.push(padding);
        }
    }

    /* eslint-disable complexity */
    collectDeclarations() {
        const {
            object: layer
        } = this;
        let declarations = [];

        this.addSizeToDeclaration(declarations);
        this.addLayoutToDeclarations(declarations);
        this.addPaddingMargin(declarations);

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

        declarations = declarations.concat(this.generateShadowDeclarations());

        declarations = declarations.concat(this.generateBorderDeclarations());

        declarations = declarations.concat(this.generateBackgroundDeclarations());

        return declarations;
    }

    get name() {
        const {
            object: {
                type,
                exportable,
                name
            }
        } = this;

        const layerName = selectorize(name);

        if (exportable) {
            const className = layerName ? layerName.replace(/^(\w)/, ".$1") : "";
            return `img${className}`;
        }

        if (type !== "text") {
            return layerName || "div";
        }

        if (isHtmlTag(layerName) && !isTextRelatedTag(layerName)) {
            return `.${layerName}`;
        }
        return layerName || "span";
    }

    get style() {
        return new RuleSet(this.name, this.declarations);
    }
}

export default Layer;
