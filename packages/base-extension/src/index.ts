import { colorCodeGenerator } from "./codeGenerators/color.js";
import { layerCodeGenerator } from "./codeGenerators/layer.js";
import { spacingCodeGenerator } from "./codeGenerators/spacing.js";
import { textStyleCodeGenerator } from "./codeGenerators/textStyle.js";
import { componentCodeGenerator } from "./codeGenerators/component/index.js";
import { Context } from "@zeplin/extension-model";
import { CodeGenerator } from "zeplin-extension-style-kit";
import { ExportCodeGeneratorParams, ExtensionCreator } from "./types.js";

const comment = (_: Context, text: string) => `/* ${text} */`;

const exportColorsGenerator: CodeGenerator<ExportCodeGeneratorParams> = (
    {
        generatorFunction,
        options: {
            prefix = "",
            suffix = ""
        } = {}
    }) => (context, colorsParam) => {
    const { code, language } = generatorFunction(context, colorsParam);
    return {
        code: `${prefix}${code}${suffix}`,
        filename: `colors.${language}`,
        language
    };
};

const exportTextStylesGenerator: CodeGenerator<ExportCodeGeneratorParams> = (
    {
        generatorFunction,
        options: {
            prefix = "",
            suffix = ""
        } = {}
    }) => (context, textStylesParam) => {
    const { code, language } = generatorFunction(context, textStylesParam);
    return {
        code: `${prefix}${code}${suffix}`,
        filename: `fonts.${language}`,
        language
    };
};

const exportSpacingGenerator: CodeGenerator<ExportCodeGeneratorParams> = (
    {
        generatorFunction,
        options: {
            prefix = "",
            suffix = ""
        } = {}
    }) => context => {
    const { code, language } = generatorFunction(context);
    return {
        code: `${prefix}${code}${suffix}`,
        filename: `spacing.${language}`,
        language
    };
};

export const createExtension: ExtensionCreator = (
    {
        language,
        Generator,
        colorsOptions,
        textStylesOptions,
        spacingOptions,
        layerOptions,
        componentOptions,
        exportColorsOptions,
        exportTextStylesOptions,
        exportSpacingOptions
    }) => {
    const component = componentCodeGenerator({ language, Generator, options: componentOptions });
    const colors = colorCodeGenerator({ language, Generator, options: colorsOptions });
    const textStyles = textStyleCodeGenerator({ language, Generator, options: textStylesOptions });
    const spacing = spacingCodeGenerator({ language, Generator, options: spacingOptions });
    const layer = layerCodeGenerator({ language, Generator, options: layerOptions });

    const exportColors = exportColorsGenerator({
        generatorFunction: colors,
        options: exportColorsOptions
    });
    const exportTextStyles = exportTextStylesGenerator({
        generatorFunction: textStyles,
        options: exportTextStylesOptions
    });
    const exportSpacing = exportSpacingGenerator({
        generatorFunction: spacing,
        options: exportSpacingOptions
    });

    const styleguideColors = colorCodeGenerator({
        language,
        Generator,
        options: colorsOptions,
        isColorsFromParam: true
    });
    const styleguideTextStyles = textStyleCodeGenerator({
        language,
        Generator,
        options: textStylesOptions,
        isTextStylesFromParam: true
    });

    const exportStyleguideColors = exportColorsGenerator({
        generatorFunction: styleguideColors,
        options: exportColorsOptions
    });

    const exportStyleguideTextStyles = exportTextStylesGenerator({
        generatorFunction: styleguideTextStyles,
        options: exportTextStylesOptions
    });

    return {
        component,
        colors,
        textStyles,
        spacing,
        layer,
        comment,
        exportColors,
        exportTextStyles,
        exportSpacing,
        styleguideColors,
        styleguideTextStyles,
        exportStyleguideColors,
        exportStyleguideTextStyles
    };
};
