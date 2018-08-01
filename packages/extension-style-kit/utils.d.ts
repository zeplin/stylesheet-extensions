import { StyleProp, StyleValue, VariableMap, StyleParams } from "./common";

declare function isHtmlTag(str: string): boolean;

declare function isPropInherited(propName: string): boolean;

declare function blendColors(colors: object[]): object;

declare function escape(str: string): string;

declare function selectorize(str: string): string;

declare function webkit(PropCls: StyleProp): StyleProp;

declare function getPropValue(value: StyleValue, variables: VariableMap, params: StyleParams): string;

declare function getUniqueLayerTextStyles(layer: object): object[];
