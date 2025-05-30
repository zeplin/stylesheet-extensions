import { Barrel, Color, Context } from "@zeplin/extension-model";
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

export type CodeGeneratorOptions = {
    prefix?: string;
    separator?: string;
    suffix?: string;
};

export type CodeGeneratorParams = {
    language: string;
    Generator: GeneratorClass;
    options?: CodeGeneratorOptions
};

export type CodeOutput = {
    code: string;
    language: string;
};

export type GeneratorFunction = (context: Context, ...params: any[]) => CodeOutput;

export type CodeGenerator<T = CodeGeneratorParams> = (params: T) => GeneratorFunction;

