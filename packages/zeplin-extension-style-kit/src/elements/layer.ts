import {
    Fill as ExtensionFill,
    Layer as ExtensionLayer,
    TextStyle as ExtensionTextStyle,
    Border as ExtensionBorder,
    Layout as ExtensionLayout
} from "@zeplin/extension-model";
import { Angle } from "../values/angle.js";
import { Color } from "../values/color.js";
import { Gradient } from "../values/gradient/index.js";
import { Length } from "../values/length.js";
import { Scalar } from "../values/scalar.js";
import { Border, BorderSide } from "../declarations/border.js";
import { Shadow } from "../declarations/shadow.js";
import { Opacity } from "../declarations/opacity.js";
import { Width } from "../declarations/width.js";
import { Height } from "../declarations/height.js";
import { ObjectFit } from "../declarations/objectFit.js";
import { Transform } from "../declarations/transform.js";
import { MixBlendMode, BlendModeValue } from "../declarations/mixBlendMode.js";
import { BorderRadius } from "../declarations/borderRadius.js";
import { BackgroundBlendMode, BlendMode } from "../declarations/backgroundBlendMode.js";
import { BackgroundImage } from "../declarations/backgroundImage.js";
import { BackgroundColor } from "../declarations/backgroundColor.js";
import { BackgroundClip } from "../declarations/backgroundClip.js";
import { BackgroundOrigin } from "../declarations/backgroundOrigin.js";
import { TextFillColor } from "../declarations/textFillColor.js";
import { TextStroke } from "../declarations/textStroke.js";
import { BorderImageSource } from "../declarations/borderImageSource.js";
import { BorderWidth } from "../declarations/borderWidth.js";
import { BorderStyle } from "../declarations/borderStyle.js";
import { BorderImageSlice } from "../declarations/borderImageSlice.js";
import { BackdropFilter } from "../declarations/backdropFilter.js";
import { Filter } from "../declarations/filter.js";
import { FontColor } from "../declarations/fontColor.js";
import { Margin } from "../declarations/margin.js";
import { Padding } from "../declarations/padding.js";
import { Display } from "../declarations/display.js";
import { FlexDirection } from "../declarations/flexDirection.js";
import { Gap } from "../declarations/gap.js";
import { TextStyle } from "./textStyle.js";
import { RuleSet } from "../ruleSet.js";
import {
    blendColors,
    isHtmlTag,
    isTextRelatedTag,
    selectorize,
    webkit
} from "../utils.js";
import { Bound } from "./utility/bound.js";
import { JustifyContent } from "../declarations/justifyContent.js";
import { AlignItems, AlignItemsValue } from "../declarations/alignItems.js";
import { AlignSelf, AlignSelfValue } from "../declarations/alignSelf.js";
import { FlexGrow } from "../declarations/flexGrow.js";
import { StyleDeclaration } from "../common.js";

const useRemUnitForMeasurement = ({ useForMeasurements }: {
    useForMeasurements: boolean
}): boolean => useForMeasurements;

const borderPositionShadowTypeMapper: Record<string, string> = {
    inside: "inner",
    outside: "outer"
} as const;

export class Layer {
    private object: ExtensionLayer;
    private declarations: StyleDeclaration[];

    constructor(layer: ExtensionLayer) {
        this.object = layer;
        this.declarations = this.collectDeclarations();
    }

    static fillToGradient(fill: ExtensionFill, width: number, height: number): Gradient {
        return fill.type === ExtensionFill.TYPE.COLOR
            ? new Color(fill.color!).toGradient()
            : new Gradient(fill.gradient!, width, height);
    }

    get hasBlendMode(): boolean {
        return this.object.fills.some(f => f.blendMode && f.blendMode !== "normal");
    }

    get hasGradient(): boolean {
        return this.object.fills.some(f => f.type === ExtensionFill.TYPE.GRADIENT);
    }

    get hasFill(): boolean {
        return this.object.fills.length > 0;
    }

    getLayerTextStyleDeclarations(textStyle: ExtensionTextStyle) {
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
                let blentColor = blendColors(layer.fills.map(fill => fill.color!).filter(Boolean));

                if (textStyle.color) {
                    blentColor = blentColor.blend(textStyle.color);
                }

                declarations.push(new FontColor(new Color(blentColor)));
            }
        }

        return declarations;
    }

    blendBorders(accumulator: ExtensionBorder, current: ExtensionBorder): ExtensionBorder {
        if (accumulator.fill.type === ExtensionFill.TYPE.COLOR
            && current.fill.type === ExtensionFill.TYPE.COLOR) {
                accumulator.fill = Object.assign({}, accumulator.fill, {
                    color: current.fill.color!.blend(accumulator.fill.color!)
                })
                return accumulator;
        } else if (accumulator.fill.type === ExtensionFill.TYPE.GRADIENT) {
            accumulator.fill = Object.assign(
                {},
                accumulator.fill,
                {
                    gradient: Object.assign(
                        {},
                        accumulator.fill.gradient,
                        {
                            colorStops: accumulator.fill?.gradient?.colorStops?.map(({ position, color }) => ({
                                position,
                                color: current.fill?.color?.blend(color)
                            }))
                        }
                    )
                }
            );
            return accumulator;
        }

        accumulator.fill = Object.assign(
            {},
            current.fill,
            {
                gradient: Object.assign(
                    {},
                    current.fill.gradient,
                    {
                        colorStops: current.fill?.gradient?.colorStops?.map(({ position, color }) => ({
                            position,
                            color: color.blend(accumulator.fill.color!)
                        }))
                    }
                )
            }
        );
        return accumulator;
    }

    get elementBorder(): ExtensionBorder | null {
        const { object: { borders } } = this;

        if (!this.shouldDrawBorder()) {
            return null;
        }

        if (borders.length === 1) {
            return borders[0];
        }

        return borders.reduce(this.blendBorders);
    }

    get backgroundImages(): Gradient[] | null {
        let bgImages: Gradient[] | null = null;

        if (!this.hasFill) {
            return null;
        }

        if (this.hasGradient || this.hasBlendMode) {
            bgImages = this.object.fills.map(fill =>
                Layer.fillToGradient(fill, this.object.rect.width, this.object.rect.height)
            );
        }

        if (this.elementBorder) {
            if (this.object.borderRadius && this.elementBorder.fill.type === ExtensionFill.TYPE.GRADIENT) {
                const borderFill = new Gradient(
                    this.elementBorder.fill.gradient!,
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

    get fillColor(): Color | null {
        if (this.hasFill && !this.hasGradient && !this.hasBlendMode) {
            return new Color(blendColors(this.object.fills.map(fill => fill.color!)));
        }

        return null;
    }

    shouldDrawBorder(): boolean {
        const {
            object: {
                borders
            }
        } = this;

        const gradientCount = borders.filter(({ fill }) => fill.type === ExtensionFill.TYPE.GRADIENT).length;

        if (gradientCount > 1 || borders.length === 0) {
            return false;
        }

        const [{ position, thickness, individualThickness }] = borders;

        if (individualThickness) {
            return borders.every(border =>
                border.position === position &&
                border.thickness === thickness &&
                border.individualThickness &&
                border.individualThickness.top === individualThickness.top &&
                border.individualThickness.right === individualThickness.right &&
                border.individualThickness.bottom === individualThickness.bottom &&
                border.individualThickness.left === individualThickness.left
            );
        }

        return borders.every(border => border.position === position && border.thickness === thickness);
    }

    generateBorderDeclarations(): StyleDeclaration[] {
        if (!this.shouldDrawBorder()) {
            return [];
        }

        const layer = this.object;
        const fill = this.elementBorder?.fill;
        const thickness = this.elementBorder?.thickness;
        const individualThickness = this.elementBorder?.individualThickness;

        if (layer.type === "text" && fill?.type === ExtensionFill.TYPE.COLOR) {
            return [
                new (webkit(TextStroke))(new Length(thickness!), new Color(fill.color!))
            ];
        }

        switch (fill?.type) {
            case ExtensionFill.TYPE.COLOR: {
                if (individualThickness) {
                    return Object.entries(individualThickness)
                        .filter(([, sideWidth]) => sideWidth > 0)
                        .map(([side, sideWidth]) => new Border({
                            style: "solid",
                            width: new Length(sideWidth),
                            color: new Color(fill.color!),
                            side: side as BorderSide
                        }));
                }

                return [
                    new Border({
                        style: "solid",
                        width: new Length(thickness!),
                        color: new Color(fill.color!),
                        side: "all"
                    })
                ];
            }
            case ExtensionFill.TYPE.GRADIENT: {
                if (individualThickness) {
                    return [];
                }

                return [
                    new BorderStyle("solid"),
                    new BorderWidth(new Length(thickness!)),
                    new BorderImageSource(new Gradient(fill.gradient!, layer.rect.width, layer.rect.height)),
                    new BorderImageSlice(new Scalar(1))
                ];
            }

            default:
                return [];
        }
    }

    shouldDrawShadowFromBorder(): boolean {
        const {
            object: {
                borders
            }
        } = this;

        return !this.shouldDrawBorder() &&
            borders.length > 1 &&
            borders.every(({ fill }) => fill.type === ExtensionFill.TYPE.COLOR);
    }

    shadowOffset(): number {
        const {
            object: {
                borders
            }
        } = this;
        const maxThickness = Math.max(...(borders || []).map(({ thickness }) => thickness || 0));

        switch (borders[0].position) {
            case "outside":
                return maxThickness;
            case "center":
                return maxThickness / 2;
            case "inside":
            default:
                return 0;
        }
    }

    generateShadowDeclarations(): StyleDeclaration[] {
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
                    Object.assign({}, border, { thickness: (border.thickness || 0) / 2, position: "inside" }),
                    Object.assign({}, border, { thickness: (border.thickness || 0) / 2, position: "outside" })
                ] : border
        ));

        const borderShadows = bordersWithoutCenter.reverse().map(({ fill: { color }, thickness, position }) => ({
            type: borderPositionShadowTypeMapper[position!],
            color: color!,
            offsetY: 0,
            offsetX: 0,
            blurRadius: 0,
            spread: thickness!
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

    generateBlurDeclarations(): StyleDeclaration[] {
        const { blur } = this.object;
        const filterFns = [{ fn: "blur", args: [new Length(blur!.radius)] }];

        if (blur!.type === "background") {
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

    generateBackgroundDeclarations(): StyleDeclaration[] {
        const { backgroundImages, elementBorder, fillColor, object: layer } = this;
        const declarations = [];

        if (this.hasFill && this.hasBlendMode) {
            declarations.push(new BackgroundBlendMode((layer.fills || []).map(fill => fill.blendMode as BlendMode)));
        }

        if (backgroundImages) {
            declarations.push(new BackgroundImage(backgroundImages));

            if (layer.borderRadius && elementBorder && elementBorder.fill.type === ExtensionFill.TYPE.GRADIENT) {
                declarations.push(new BackgroundOrigin(["border-box"]));
                declarations.push(new BackgroundClip([...Array(backgroundImages.length - 1).fill("content-box"), "border-box"]));
            }
        } else if (fillColor) {
            declarations.push(new BackgroundColor(fillColor));
        }

        return declarations;
    }

    shouldAddWidth(): boolean {
        const {
            object: {
                parent,
                layoutGrow,
                layoutAlignment
            }
        } = this;
        return !parent || !parent.layout || (
            parent.layout.direction === ExtensionLayout.DIRECTION.ROW
                ? layoutGrow === 0
                : layoutAlignment !== ExtensionLayout.ALIGNMENT.STRETCH
        );
    }

    shouldAddHeight(): boolean {
        const {
            object: {
                parent,
                layoutGrow,
                layoutAlignment
            }
        } = this;
        return !parent || !parent.layout || (
            parent.layout.direction === ExtensionLayout.DIRECTION.COLUMN
                ? layoutGrow === 0
                : layoutAlignment !== ExtensionLayout.ALIGNMENT.STRETCH
        );
    }

    addSizeToDeclaration(declarations: StyleDeclaration[]): void {
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

    addLayoutToDeclarations(declarations: StyleDeclaration[]): void {
        const {
            object: {
                layout,
                layoutAlignment,
                layoutGrow
            }
        } = this;

        if (layoutAlignment && layoutAlignment !== ExtensionLayout.ALIGNMENT.INHERIT) {
            declarations.push(new AlignSelf(layoutAlignment as AlignSelfValue));
        }

        if (layoutGrow !== void 0) {
            declarations.push(new FlexGrow(new Scalar(layoutGrow)));
        }

        if (layout && layout.direction) {
            const {
                direction,
                distribution,
                itemAlignment,
                gap = 0
            } = layout;

            declarations.push(
                Display.flex(),
                new FlexDirection(direction)
            );
            if (distribution) {
                declarations.push(new JustifyContent(distribution));
            }
            if (itemAlignment) {
                declarations.push(new AlignItems(itemAlignment as AlignItemsValue));
            }
            if (gap > 0) {
                declarations.push(new Gap(new Length(gap)));
            }
        }
    }

    addPaddingMargin(declarations: StyleDeclaration[]): void {
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
                    top: new Length(layout.padding.top!, { useRemUnit: useRemUnitForMeasurement }),
                    right: new Length(layout.padding.right!, { useRemUnit: useRemUnitForMeasurement }),
                    bottom: new Length(layout.padding.bottom!, { useRemUnit: useRemUnitForMeasurement }),
                    left: new Length(layout.padding.left!, { useRemUnit: useRemUnitForMeasurement })
                })
            );
        } else if (padding && !padding.equals(Padding.Zero)) {
            declarations.push(padding);
        }
    }

    collectDeclarations(): StyleDeclaration[] {
        const {
            object: layer
        } = this;
        let declarations: StyleDeclaration[] = [];

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
            declarations.push(new MixBlendMode(layer.blendMode as BlendModeValue));
        }

        if (layer.borderRadius) {
            // TODO: different radii for each corner?
            declarations.push(new BorderRadius(new Length(layer.borderRadius as number)));
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
