import { Color } from "@zeplin/extension-model";

export type StyleParams = AllParams | ColorParams | LengthParams;

export interface StyleValue {
    valueOf(): string;

    equals(other: StyleValue): boolean;

    toStyleValue(params: StyleParams, colorNameResolver?: ColorNameResolver): string;
}

export interface StyleDeclaration {
    name: string;

    hasDefaultValue?(): boolean;

    equals(other: StyleDeclaration): boolean;

    toStyleValue?(params: StyleParams, colorNameResolver: ColorNameResolver): string;

    getValue(params: StyleParams, colorNameResolver: ColorNameResolver): string | number;
}

export type ColorFormat = "hex" | "rgb" | "hsl";
export type NamingScheme = "constant" | "camel" | "snake" | "kebab" | "pascal" | "none";

export interface AllParams {
    densityDivisor?: number;
    colorFormat?: ColorFormat;
    unitlessLineHeight?: boolean;
}

export interface ColorParams {
    colorFormat: ColorFormat;
}

export interface RemPreferences {
    useForFontSizes: boolean;
    useForMeasurements: boolean;
    rootFontSize: number;
}

export interface LengthParams {
    densityDivisor: number;
    remPreferences?: RemPreferences;
}

export interface LengthOptions {
    precision?: number;
    useRemUnit?: boolean | ((remPreferences: RemPreferences) => boolean);
    useDensityDivisor?: boolean;
}

export interface StyleFunction {
    fn: string;
    args: Array<StyleValue>;
}

export type ColorNameResolver = (colorObject: Color, shouldDisplayDefaultValue?: boolean) => string;

export interface ContextParams {
    densityDivisor: number;
    useLinkedStyleguides: boolean;
    colorFormat: ColorFormat;
    variableNameFormat: NamingScheme;
    showDimensions: boolean;
    showDefaultValues: boolean;
    unitlessLineHeight: boolean;
    useMixin: boolean;
    remPreferences: RemPreferences | undefined;
    showPaddingMargin: boolean;
}