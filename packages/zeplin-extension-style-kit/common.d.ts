import Gradient from "./values/gradient";

declare namespace zesk {
    type BackgroundImage = Gradient;
    type StyleParams = AllParams | ColorParams | LengthParams;

    interface StyleValue {
        valueOf(): string;
        equals(other: StyleValue);
        toStyleValue(params: StyleParams, variables: VariableMap);
    }

    interface StyleDeclaration {
        name: string;
        hasDefaultValue?(): boolean;
        equals(other: StyleDeclaration): boolean;
        getValue(params: StyleParams, variables: VariableMap);
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
        rootFontSize: number;
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
