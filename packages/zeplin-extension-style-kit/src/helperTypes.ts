import { Barrel, Color, Extension } from "@zeplin/extension-model";
import { ContextParams, StyleDeclaration, StyleValue } from "./common.js";
import { AtRule } from "./atRule.js";
import { RuleSet } from "./ruleSet.js";

export interface GeneratorClass {
    new<T extends Barrel>(barrel: T, param: ContextParams): Generator;
}

export type RuleSetOptions = {
    parentDeclarations?: StyleDeclaration[]
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
    prefix?: string;
    separator?: string;
    suffix?: string;
};

export type ExtensionMethodCreatorParams = {
    language: string;
    Generator: GeneratorClass;
    options?: ExtensionMethodOptions
};

export type ExtensionMethodName = keyof Extension;

export type ExtensionMethod<T extends ExtensionMethodName> = NonNullable<Extension[T]>;

export type ExtensionMethodCreator<T extends ExtensionMethodName, K = ExtensionMethodCreatorParams> = (params: K) => NonNullable<ExtensionMethod<T>>;

export type ExtensionMethodReturnType<T extends ExtensionMethodName> = ReturnType<ExtensionMethod<T>>;

