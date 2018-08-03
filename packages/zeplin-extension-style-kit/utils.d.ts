import { StyleDeclaration, StyleValue, VariableMap, StyleParams } from "./common";

declare function isHtmlTag(str: string): boolean;

declare function isDeclarationInherited(propName: string): boolean;

declare function blendColors(colors: object[]): object;

declare function escape(str: string): string;

declare function selectorize(str: string): string;

declare function webkit(DeclarationCls: StyleDeclaration): StyleDeclaration;

declare function getDeclarationValue(value: StyleValue, variables: VariableMap, params: StyleParams): string;

declare function getUniqueLayerTextStyles(layer: object): object[];
