import Gradient from "./values/gradient";

declare namespace zesk {
    type BackgroundImage = Gradient;
    type StyleParams = AllParams | ColorParams | LengthParams;

    interface StyleValue {
        valueOf(): string;
        equals(other: StyleValue);
        // TODO: add @zeplin/extension-model types
        toStyleValue(params: StyleParams, container: object, formatColorVariable: (colorObject: object) => string): string;
    }

    interface StyleDeclaration {
        name: string;
        hasDefaultValue?(): boolean;
        equals(other: StyleDeclaration): boolean;
        // TODO: add @zeplin/extension-model types
        toStyleValue(params: StyleParams, container: object, formatColorVariable: (colorObject: object) => string): string;
    }

    interface AllParams {
        densityDivisor?: number;
        colorFormat?: string;
        unitlessLineHeight?: boolean;
    }

    interface ColorParams {
        colorFormat: string;
    }

    interface RemPreferences {
        useForFontSizes: boolean;
        useForMeasurements: boolean;
        rootFontSize: number;
    }

    interface LengthParams {
        densityDivisor: number;
        remPreferences?: RemPreferences;
    }

    interface LengthOptions {
        precision?: number;
        useRemUnit?: boolean | ((remPreferences: RemPreferences) => boolean);
        useDensityDivisor?: boolean;
    }

    interface StyleFunction {
        fn: string,
        args: Array<string | StyleValue>
    }

    interface VariableMap {
        [key: string]: string
    }
}


export = zesk;
