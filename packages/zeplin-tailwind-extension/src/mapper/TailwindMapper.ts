import {
    AlignItems,
    AlignSelf,
    BackdropFilter,
    BackgroundBlendMode,
    BackgroundClip,
    BackgroundColor,
    BackgroundImage,
    BackgroundOrigin,
    Border,
    BorderImageSlice,
    BorderImageSource,
    BorderRadius,
    BorderStyle,
    BorderWidth,
    Color,
    ColorNameResolver,
    ContextParams,
    DeclarationMapper,
    Display,
    Filter,
    FlexDirection,
    FlexGrow,
    FontColor,
    FontFamily,
    FontSize,
    FontSrc,
    FontStretch,
    FontStyle,
    FontVariationSettings,
    FontWeight,
    Gap,
    generateVariableName,
    Height,
    JustifyContent,
    Length,
    LetterSpacing,
    LineHeight,
    Margin,
    MixBlendMode,
    ObjectFit,
    Opacity,
    Padding,
    Shadow,
    StyleDeclaration,
    StyleFunction,
    TextAlign,
    TextFillColor,
    TextStroke,
    Transform,
    Width
} from "zeplin-extension-style-kit";
import { findMatchingClassValue } from "./predefined-class-values.js";
import { getValueInPixels } from "../util.js";

type LengthDeclaration = Width | Height | Gap;

export class TailwindMapper implements DeclarationMapper {
    private readonly params: ContextParams;
    private readonly colorNameResolver: ColorNameResolver;
    private readonly spacingValue: number;

    constructor(mapperOptions: {
        params: ContextParams,
        colorNameResolver: ColorNameResolver,
        spacingValue: number,
    }) {
        const {
            params,
            colorNameResolver,
            spacingValue = 1
        } = mapperOptions;
        this.params = params;
        this.colorNameResolver = colorNameResolver;
        this.spacingValue = spacingValue;
    }

    mapValue(d: StyleDeclaration): string {
        return this.mapDeclaration(d);
    }

    private mapDeclaration(declaration: StyleDeclaration) {
        switch (declaration.constructor) {
            // Layout
            case Display:
                return this.mapDisplay(declaration as Display);
            case ObjectFit:
                return this.mapObjectFit(declaration as ObjectFit);

            // Flexbox & Grid
            case FlexDirection:
                return this.mapFlexDirection(declaration as FlexDirection);
            case FlexGrow:
                return this.mapFlexGrow(declaration as FlexGrow);
            case JustifyContent:
                return this.mapJustifyContent(declaration as JustifyContent);
            case AlignItems:
                return this.mapAlignItems(declaration as AlignItems);
            case AlignSelf:
                return this.mapAlignSelf(declaration as AlignSelf);
            case Gap:
                return this.mapGap(declaration as Gap);

            // Sizing
            case Width:
                return this.mapLength("w", declaration as Width);
            case Height:
                return this.mapLength("h", declaration as Height);

            // Spacing
            case Margin:
                return this.handleFourDirectionalValue("m", declaration as Margin);
            case Padding:
                return this.handleFourDirectionalValue("p", declaration as Margin);

            // Typography
            case FontColor:
                return this.mapFontColor(declaration as FontColor);
            case FontFamily:
                return this.mapFontFamily(declaration as FontFamily);
            case FontSize:
                return this.mapFontSize(declaration as FontSize);
            case FontWeight:
                return this.mapFontWeight(declaration as FontWeight);
            case FontStyle:
                return this.mapFontStyle(declaration as FontStyle);
            case FontStretch:
                return this.mapFontStretch(declaration as FontStretch);
            case FontVariationSettings:
                return "";
            case FontSrc:
                return "";
            case LineHeight:
                return this.mapLineHeight(declaration as LineHeight);
            case LetterSpacing:
                return this.mapLetterSpacing(declaration as LetterSpacing);
            case TextAlign:
                return this.mapTextAlign(declaration as TextAlign);
            case TextFillColor:
                return "";
            case TextStroke:
                return this.mapTextStroke(declaration as TextStroke);

            // Backgrounds
            case BackgroundColor:
                return this.mapBackgroundColor(declaration as BackgroundColor);
            case BackgroundImage:
                return this.mapBackgroundImage(declaration as BackgroundImage);
            case BackgroundClip:
                return this.mapBackgroundClip(declaration as BackgroundClip);
            case BackgroundOrigin:
                return this.mapBackgroundOrigin(declaration as BackgroundOrigin);
            case BackgroundBlendMode:
                return this.mapBackgroundBlendMode(declaration as BackgroundBlendMode);

            // Borders
            case Border:
                return this.mapBorder(declaration as Border);
            case BorderRadius:
                return this.mapBorderRadius(declaration as BorderRadius);
            case BorderStyle:
                return this.mapBorderStyle(declaration as BorderStyle);
            case BorderWidth:
                return this.mapBorderWidth((declaration as BorderWidth).width);
            case BorderImageSlice:
                return "";
            case BorderImageSource:
                return "";

            // Effects
            case Shadow:
                return this.mapBoxShadow(declaration as Shadow);
            case Opacity:
                return this.mapOpacity(declaration as Opacity);
            case MixBlendMode:
                return this.mapMixBlendMode(declaration as MixBlendMode);
            case Filter:
                return this.mapFilter(declaration as Filter);
            case BackdropFilter:
                return this.mapBackdropFilter(declaration as BackdropFilter);

            // Transforms
            case Transform:
                return this.mapTransform(declaration as Transform);

            // Default case for any unhandled declarations
            default:
                return "";
        }
    }

    private mapBackgroundColor(declaration: BackgroundColor): string {
        return `bg-${declaration.getValue(this.params, this.colorNameResolver)}`;
    }

    private mapFontColor(declaration: FontColor): string {
        const value = declaration.getValue(this.params, this.colorNameResolver);
        return value.startsWith("#") ? `text-${value}` : `text-[${value}]`;
    }

    private mapFontSize(declaration: FontSize): string {
        const value = declaration.getValue(this.params);
        const classValue = findMatchingClassValue(this.getPixelValue(value)!, "text");
        return classValue
            ? `text-${classValue}`
            : `text-[${value}]`;
    }


    private mapTransform(declaration: Transform): string {
        return `transform-${declaration.getValue(this.params, this.colorNameResolver)}`;
    }

    private mapLength(prefix: string, declaration: LengthDeclaration): string {
        const stringValue = declaration.getValue(this.params);
        // Convert to number if it's a string
        const numericValue = this.getPixelValue(stringValue);

        // If not a valid number, return as arbitrary value
        if (!numericValue) {
            return this.getArbitraryValue(prefix, stringValue);
        }

        const classValue = findMatchingClassValue(numericValue, "spacing-class");

        // If found, use the predefined value, e.g. "w-sm"
        // Otherwise use spacing value e.g. "w-4"
        return classValue !== null
            ? `${prefix}-${classValue}`
            : `${prefix}-${this.getPrintableValue(stringValue)}`;
    }

    private mapOpacity(value: Opacity): string {
        const percentValue = value.getValue();

        return `opacity-${percentValue.replace("%", "")}`;
    }

    private handleFourDirectionalValue(prefix: string, declaration: Margin | Padding): string {
        const { top, right, bottom, left } = declaration;

        // Get all values in pixels
        const topPx = this.getPixelValue(top);
        const rightPx = this.getPixelValue(right);
        const bottomPx = this.getPixelValue(bottom);
        const leftPx = this.getPixelValue(left);

        // Helper to get the Tailwind class for a single value
        const getValueClass = (value: Length, direction: string) => {
            const valueInPixels = this.getPixelValue(value);
            if (!valueInPixels) {
                return ""
            }
            const predefined = findMatchingClassValue(valueInPixels, "spacing-class");
            return predefined !== null
                ? `${prefix}${direction}-${predefined}`
                : `${prefix}${direction}-${this.getPrintableValue(value)}`;
        };

        const values: string[] = [];
        if (topPx === rightPx && rightPx === bottomPx && bottomPx === leftPx) {
            // All sides equal
            values.push(getValueClass(top, ""));
        } else if (topPx === bottomPx && rightPx === leftPx) {
            // Vertical | Horizontal
            values.push(getValueClass(top, "y"));
            values.push(getValueClass(right, "h"));
        } else if (rightPx === leftPx) {
            // Top | Horizontal | Bottom
            values.push(getValueClass(top, "t"));
            values.push(getValueClass(right, "x"));
            values.push(getValueClass(bottom, "b"));
        } else {
            // All sides different
            values.push(getValueClass(top, "t"));
            values.push(getValueClass(right, "r"));
            values.push(getValueClass(bottom, "b"));
            values.push(getValueClass(left, "l"));
        }

        return values.filter(Boolean).join(" ");
    }

    private mapAlignItems(declaration: AlignItems): string {
        const valueMap: Record<string, string> = {
            "center": "items-center",
            "flex-end": "items-end",
            "flex-start": "items-start",
            "stretch": "items-stretch"
        };
        return valueMap[declaration.getValue()] || "";
    }

    private mapAlignSelf(declaration: AlignSelf): string {
        const valueMap: Record<string, string> = {
            "center": "self-center",
            "flex-end": "self-end",
            "flex-start": "self-start",
            "stretch": "self-stretch"
        };
        return valueMap[declaration.getValue()] || "";
    }

    private mapBackgroundBlendMode(declaration: BackgroundBlendMode): string {
        const valueMap: Record<string, string> = {
            "normal": "bg-blend-normal",
            "multiply": "bg-blend-multiply",
            "screen": "bg-blend-screen",
            "overlay": "bg-blend-overlay",
            "darken": "bg-blend-darken",
            "lighten": "bg-blend-lighten",
            "color-dodge": "bg-blend-color-dodge",
            "color-burn": "bg-blend-color-burn",
            "hard-light": "bg-blend-hard-light",
            "soft-light": "bg-blend-soft-light",
            "difference": "bg-blend-difference",
            "exclusion": "bg-blend-exclusion",
            "hue": "bg-blend-hue",
            "saturation": "bg-blend-saturation",
            "color": "bg-blend-color",
            "luminosity": "bg-blend-luminosity"
        };
        return valueMap[declaration.getValue()] || "";
    }

    private mapBackgroundClip(declaration: BackgroundClip): string {
        const valueMap: Record<string, string> = {
            "border-box": "bg-clip-border",
            "padding-box": "bg-clip-padding",
            "content-box": "bg-clip-content",
            "text": "bg-clip-text"
        };
        return valueMap[declaration.getValue()] || "";
    }

    private mapBackgroundImage(declaration: BackgroundImage): string {
        return `bg-[${declaration.getValue(this.params, this.colorNameResolver)}]`;
    }

    private mapBackgroundOrigin(declaration: BackgroundOrigin): string {
        const valueMap: Record<string, string> = {
            "border-box": "bg-origin-border",
            "padding-box": "bg-origin-padding",
            "content-box": "bg-origin-content"
        };
        return valueMap[declaration.getValue()] || "";
    }

    private mapBorder(declaration: Border): string {
        const { width, side, color, style } = declaration;
        return [
            this.mapBorderWidth(width, side),
            this.mapColor(color),
            this.mapBorderStyle(style)
        ].filter(Boolean).join(" ");
    }

    private mapBorderWidth(length: Length, side?: string): string {
        const value = length.toStyleValue(this.params);

        let prefix = "border";
        if (side) {
            prefix = this.mapBorderSide(side);
        }
        const num = this.getPixelValue(value);

        return num
            ? `${prefix}${num > 1 ? `-${num}` : ""}`
            : this.getArbitraryValue(prefix, value);
    }

    private mapBorderSide(side: string): string {
        const valueMap: Record<string, string> = {
            "top": "border-t",
            "left": "border-l",
            "right": "border-r",
            "bottom": "border-b",
            "all": "border"
        };

        return valueMap[side] || "border";
    }

    private mapBorderRadius(declaration: BorderRadius): string {
        const value = declaration.getValue(this.params);
        const numericValue = this.getPixelValue(value);

        if (numericValue === null) {
            return this.getArbitraryValue("rounded", value);
        }

        const predefinedValue = findMatchingClassValue(numericValue, "rounded");

        return predefinedValue !== null
            ? `rounded${predefinedValue ? `-${predefinedValue}` : ""}`
            : this.getArbitraryValue("rounded", value);
    }

    private mapBorderStyle(declaration: string | BorderStyle): string {
        const valueMap: Record<string, string> = {
            "solid": "border-solid",
            "dashed": "border-dashed",
            "dotted": "border-dotted",
            "double": "border-double",
            "hidden": "border-hidden",
            "none": "border-none"
        };
        const style = typeof declaration === "string" ? declaration : declaration.getValue();
        return valueMap[style] || "";
    }

    private mapDisplay(declaration: Display): string {
        const valueMap: Record<string, string> = {
            "inline": "inline",
            "block": "block",
            "contents": "contents",
            "flex": "flex",
            "grid": "grid",
            "inline-block": "inline-block",
            "inline-flex": "inline-flex",
            "inline-grid": "inline-grid",
            "inline-table": "inline-table",
            "list-item": "list-item",
            "table": "table",
            "table-caption": "table-caption",
            "table-column-group": "table-column-group",
            "table-header-group": "table-header-group",
            "table-footer-group": "table-footer-group",
            "table-row-group": "table-row-group",
            "table-cell": "table-cell",
            "table-column": "table-column",
            "table-row": "table-row",
            "flow-root": "flow-root",
            "none": "hidden"
        };

        return valueMap[declaration.getValue()] || "";
    }

    private mapFilter(declaration: Filter): string {
        return this.mapStyleFunctions(declaration.filters);
    }

    private mapBackdropFilter(declaration: BackdropFilter): string {
        return this.mapStyleFunctions(declaration.filters);
    }

    private mapStyleFunctions(styleFunctions: StyleFunction[]): string {
        // Only "blur" is defined in style-kit
        const blurValues = styleFunctions.filter(sf => sf.fn === "blur" && sf.args.length === 1)
            .map(sf => {
                const value = sf.args[0].toStyleValue(this.params, this.colorNameResolver);
                const classValue = findMatchingClassValue(this.getPixelValue(value)!, "blur");
                return classValue !== null
                    ? `blur-${classValue}`
                    : `blur-[${this.getPixelValue(value)}]`;
            }).join(" ");

        const others = styleFunctions.filter(sf => !(sf.fn === "blur" && sf.args.length === 1))
            .map(sf => {
                const { fn, args } = sf;
                const argStrings = args.map(arg => arg.toStyleValue(this.params, this.colorNameResolver)).join(" ");
                return `${fn}-${argStrings}`;
            });

        return `${blurValues} filter-[${others}]`;
    }

    private mapFlexDirection(declaration: FlexDirection): string {
        const valueMap: Record<string, string> = {
            "row": "flex-row",
            "row-reverse": "flex-row-reverse",
            "column": "flex-col",
            "column-reverse": "flex-col-reverse"
        };
        return valueMap[declaration.getValue()] || "";
    }

    private mapFlexGrow(declaration: FlexGrow): string {
        const value = declaration.getValue();
        const num = this.getPixelValue(value);
        return `flex${num && num > 1 ? `-${num}` : ""}`;
    }

    private mapFontFamily(declaration: FontFamily): string {
        return `font-${generateVariableName(declaration.getValue(), "kebab")}`;
    }

    private mapFontStretch(declaration: FontStretch): string {
        return `font-stretch-${declaration.getValue()}`;
    }

    private mapFontStyle(declaration: FontStyle): string {
        return declaration.getValue() === "italic" ? "italic" : "not-italic";
    }

    private mapFontWeight(declaration: FontWeight): string {
        const valueMap: Record<string, string> = {
            "100": "font-thin",
            "200": "font-extralight",
            "300": "font-light",
            "400": "font-normal",
            "500": "font-medium",
            "600": "font-semibold",
            "700": "font-bold",
            "800": "font-extrabold",
            "900": "font-black",
            "normal": "font-normal",
            "bold": "font-bold"
        };
        return valueMap[String(declaration.getValue())] || "font-normal";
    }

    private mapGap(declaration: Gap): string {
        const value = declaration.getValue(this.params);
        return `gap-${this.getPrintableValue(value)}`;
    }

    private mapJustifyContent(declaration: JustifyContent): string {
        const valueMap: Record<string, string> = {
            "flex-start": "justify-start",
            "flex-end": "justify-end",
            "center": "justify-center",
            "space-between": "justify-between",
            "space-around": "justify-around",
            "space-evenly": "justify-evenly"
        };
        return valueMap[declaration.getValue()] || "";
    }

    private mapLetterSpacing(declaration: LetterSpacing): string {
        const value = `${declaration.getValue(this.params)}`;
        const valueInPixels = this.getPixelValue(value);
        return value === "normal"
            ? "tracking-normal"
            : `tracking-[${valueInPixels}]`;
    }

    private mapMixBlendMode(declaration: MixBlendMode): string {
        const valueMap: Record<string, string> = {
            "normal": "mix-blend-normal",
            "multiply": "mix-blend-multiply",
            "screen": "mix-blend-screen",
            "overlay": "mix-blend-overlay",
            "darken": "mix-blend-darken",
            "lighten": "mix-blend-lighten",
            "color-dodge": "mix-blend-color-dodge",
            "color-burn": "mix-blend-color-burn",
            "hard-light": "mix-blend-hard-light",
            "soft-light": "mix-blend-soft-light",
            "difference": "mix-blend-difference",
            "exclusion": "mix-blend-exclusion",
            "hue": "mix-blend-hue",
            "saturation": "mix-blend-saturation",
            "color": "mix-blend-color",
            "luminosity": "mix-blend-luminosity"
        };
        return valueMap[declaration.getValue()] || "";
    }

    private mapObjectFit(declaration: ObjectFit): string {
        const valueMap: Record<string, string> = {
            "contain": "object-contain",
            "cover": "object-cover",
            "fill": "object-fill",
            "none": "object-none",
            "scale-down": "object-scale-down"
        };
        return valueMap[declaration.getValue()] || "";
    }

    private mapTextAlign(declaration: TextAlign): string {
        const valueMap: Record<string, string> = {
            "left": "text-left",
            "center": "text-center",
            "right": "text-right",
            "justify": "text-justify"
        };
        return valueMap[declaration.getValue()] || "";
    }

    private mapTextStroke(declaration: TextStroke): string {
        // Text stroke is not directly supported in Tailwind - use arbitrary value handled by plugins
        const { length, color } = declaration;
        return `text-stroke-${color.toStyleValue(this.params)}-${length.toStyleValue(this.params)}`;
    };

    private getArbitraryValue(prefix: string, value: string | number): string {
        const formattedValue = typeof value === "string"
            ? value.replace(/\s+/g, "_")
            : value.toString();

        return `${prefix}-[${formattedValue}]`;
    }

    private getPixelValue(value: Length | string): number | null {
        return getValueInPixels(value, this.params);
    }

    private getPrintableValue(value: Length | string): string | null {
        const pixelValue = this.getPixelValue(value);

        if (pixelValue) {
            return this.spacingValue !== 0 && pixelValue % this.spacingValue === 0
                ? `${pixelValue / this.spacingValue}`
                : `[${pixelValue}px]`; // Wrap with brackets if spacingValue is an exact divisor
        }
        return null;
    }

    private mapLineHeight(declaration: LineHeight): string {
        const value = declaration.getValue(this.params);
        return value !== "normal"
            ? `leading-${this.getPrintableValue(value)}`
            : `leading-none`;
    }

    private mapColor(color: Color) {
        return color.toStyleValue(this.params, this.colorNameResolver);
    }

    private mapBoxShadow(declaration: Shadow) {
        const prefix = declaration.type === "box" ? "shadow" : "text-shadow";
        return `${prefix}-[${declaration.getValue(this.params, this.colorNameResolver)}]`;
    }
}