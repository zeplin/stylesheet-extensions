import { Barrel, Color, Extension } from "@zeplin/extension-model";
import { ContextParams, StyleDeclaration, StyleValue } from "./common.js";
import { AtRule } from "./atRule.js";
import { RuleSet } from "./ruleSet.js";

export interface GeneratorClass {
    new<T extends Barrel>(barrel: T, param: ContextParams, options?: DeclarationOptions, ...rest: any[]): Generator;
}

/**
 * Indiviual rule/declaration options
 */
export type DeclarationOptions = {
    namePrefix?: string;
    nameSuffix?: string;
    valuePrefix?: string;
    valueSuffix?: string;
    nameValueSeparator?: string;
    wrapperPrefix?: string;
    wrapperSuffix?: string;
}

/**
 * Rule/declaration block options
 */
export type DeclarationBlockOptions = {
    prefix?: string;
    separator?: string;
    suffix?: string;
}

export type RuleSetOptions = {
    parentDeclarations?: StyleDeclaration[];
    scope?: string;
    mixin?: boolean;
};

export interface Generator {
    formatColorVariable: (color: Color) => string;
    filterDeclarations: (childDeclarations: StyleDeclaration[], parentDeclarations: StyleDeclaration[]) => StyleDeclaration[];
    variable: (name: string, value: StyleValue) => string;
    ruleSet: (ruleSet: RuleSet, options?: RuleSetOptions) => string;
    atRule: (atRule: AtRule) => string;
}

export type ExtensionMethodOptions = {
    language?: string;
    declarationBlockOptions?: DeclarationBlockOptions;
    declarationOptions?: DeclarationOptions;
    [key: string]: any;
};

export type ExtensionMethodCreatorParams = {
    Generator: GeneratorClass;
    options?: ExtensionMethodOptions;
};

export type ExtensionMethodName = keyof Extension;

export type ExtensionMethod<T extends ExtensionMethodName> = NonNullable<Extension[T]>;

export type ExtensionMethodCreator<T extends ExtensionMethodName, K = ExtensionMethodCreatorParams> = (params: K) => NonNullable<ExtensionMethod<T>>;

export type ExtensionMethodReturnType<T extends ExtensionMethodName> = ReturnType<ExtensionMethod<T>>;

