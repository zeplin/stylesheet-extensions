import {
    CodeGeneratorOptions,
    CodeGeneratorParams,
    GeneratorFunction
} from "zeplin-extension-style-kit";
import { ColorCodeGeneratorOptions } from "./codeGenerators/color";
import { TextStyleCodeGeneratorOptions } from "./codeGenerators/textStyle";
import { Context } from "@zeplin/extension-model";

export type ExtensionCreatorParams = Omit<CodeGeneratorParams, "options"> & {
    colorsOptions?: ColorCodeGeneratorOptions,
    textStylesOptions?: TextStyleCodeGeneratorOptions,
    spacingOptions?: CodeGeneratorOptions,
    layerOptions?: CodeGeneratorOptions,
    componentOptions?: CodeGeneratorOptions,
    exportColorsOptions?: CodeGeneratorOptions,
    exportTextStylesOptions?: CodeGeneratorOptions,
    exportSpacingOptions?: CodeGeneratorOptions;
};

export type ExtensionCreatorOutput = {
    component: GeneratorFunction,
    colors: GeneratorFunction,
    textStyles: GeneratorFunction,
    spacing: GeneratorFunction,
    layer: GeneratorFunction,
    comment: (context: Context, text: string) => string,
    exportColors: GeneratorFunction,
    exportTextStyles: GeneratorFunction,
    exportSpacing: GeneratorFunction,
    styleguideColors: GeneratorFunction,
    styleguideTextStyles: GeneratorFunction,
    exportStyleguideColors: GeneratorFunction,
    exportStyleguideTextStyles: GeneratorFunction
};

export type ExtensionCreator = (params: ExtensionCreatorParams) => ExtensionCreatorOutput;

export type ExportCodeGeneratorParams = {
    generatorFunction: GeneratorFunction
    options?: CodeGeneratorOptions
};