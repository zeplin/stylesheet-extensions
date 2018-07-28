import Gradient from "./values/gradient";

declare namespace zesk {
    type BackgroundImage = Gradient;

    interface StyleValue {
        equals(other: StyleValue);
        toStyleValue(params: StyleParams, variables: VariableMap);
    }

    interface StyleProp {
        name: string;
        hasDefaultValue(): boolean;
        equals(other: StyleProp): boolean;
        getValue(params: StyleParams, variables: VariableMap);
    }

    interface StyleParams {
        densityDivisor?: number;
        colorFormat?: string;
    }

    interface ColorParams extends StyleParams {
        colorFormat: string;
    }

    interface LengthParams extends StyleParams {
        densityDivisor: number;
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