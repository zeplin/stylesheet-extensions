import { StyleDeclaration } from "./common";

declare function isHtmlTag(str: string): boolean;

declare function isTextRelatedTag(str: string): boolean;

declare function isDeclarationInherited(propName: string): boolean;

declare function blendColors(colors: object[]): object;

declare function escape(str: string): string;

declare function selectorize(str: string): string;

declare function webkit(DeclarationCls: StyleDeclaration): StyleDeclaration;

declare function getUniqueLayerTextStyles(layer: object): object[];

declare function getResourceContainer(context: object): object;

declare function getResources({ context: object, useLinkedStyleguides: boolean, key: string }): object[];

declare function getUniqueFirstItems<T>(array: T[], equalityFunction: (arg1: T, arg2: T) => boolean): T[];

interface GenerateColorNameFinderParams {
    context: object;
    useLinkedStyleguides: boolean;
    formatVariableName: (color: object) => string | undefined;
}

declare function generateColorNameResolver(params: GenerateColorNameFinderParams): (color: object) => string | undefined;

declare function generateVariableName(value: string, namingScheme: "kebab" | "snake" | "constant" | "camel" | "pascal" | "none"): string;
