import { StyleDeclaration, StyleValue, VariableMap, StyleParams } from "./common";

declare function isHtmlTag(str: string): boolean;

declare function isDeclarationInherited(propName: string): boolean;

declare function blendColors(colors: object[]): object;

declare function escape(str: string): string;

declare function selectorize(str: string): string;

declare function webkit(DeclarationCls: StyleDeclaration): StyleDeclaration;

declare function getDeclarationValue(value: StyleValue, variables: VariableMap, params: StyleParams): string;

declare function getUniqueLayerTextStyles(layer: object): object[];

declare function getResourceContainer(context: object): object;

declare function getResources({ context: object, useLinkedStyleguides: boolean, key: string }): object[];

declare function getUniqueFirstItems<T>(array: T[], equalityFunction: (arg1: T, arg2: T) => boolean): T[];