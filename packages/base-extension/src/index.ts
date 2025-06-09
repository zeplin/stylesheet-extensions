import { createColorsExtensionMethod } from "./codeGenerators/color.js";
import { createLayerExtensionMethod } from "./codeGenerators/layer.js";
import { createSpacingExtensionMethod } from "./codeGenerators/spacing.js";
import { createTextStylesExtenionMethod } from "./codeGenerators/textStyle.js";
import { createComponentExtensionMethod } from "./codeGenerators/component/index.js";
import { Context, Extension } from "@zeplin/extension-model";
import { ExtensionMethodCreator, ExtensionMethodOptions, ExtensionMethodReturnType } from "zeplin-extension-style-kit";
import { ExportExtensionMethodCreatorParams, ExtensionCreator } from "./types.js";

const comment = (_: Context, text: string) => `/* ${text} */`;

const exportColorsExtensionMethod: ExtensionMethodCreator<"exportColors", ExportExtensionMethodCreatorParams> = (
    {
        baseMethod,
        options: {
            declarationBlockOptions: {
                prefix = "",
                suffix = ""
            } = {}
        } = {}
    }) => (context: Context): ExtensionMethodReturnType<"exportColors"> => {
    const { code, language } = baseMethod(context);
    return {
        code: `${prefix}${code}${suffix}`,
        filename: `colors.${language}`,
        language
    };
};

const exportTextStylesExtensionMethod: ExtensionMethodCreator<"exportTextStyles", ExportExtensionMethodCreatorParams> = (
    {
        baseMethod,
        options: {
            declarationBlockOptions: {
                prefix = "",
                suffix = ""
            } = {}
        } = {}
    }) => (context: Context): ExtensionMethodReturnType<"exportTextStyles"> => {
    const { code, language } = baseMethod(context);
    return {
        code: `${prefix}${code}${suffix}`,
        filename: `fonts.${language}`,
        language
    };
};

const createExportSpacingExtensionMethod: ExtensionMethodCreator<"exportSpacing", ExportExtensionMethodCreatorParams> = (
    {
        baseMethod,
        options: {
            declarationBlockOptions: {
                prefix = "",
                suffix = ""
            } = {}
        } = {}
    }) => (context): ExtensionMethodReturnType<"exportSpacing"> => {
    const { code, language } = baseMethod(context);
    return {
        code: `${prefix}${code}${suffix}`,
        filename: `spacing.${language}`,
        language
    };
};

const processOptions = <T extends ExtensionMethodOptions>(
    options: T = {} as T,
    defaultLanguage?: string
): T & { language: string; } => ({
    ...options,
    language: (options.language || defaultLanguage)!,
});

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
    }): Extension => {
    const component = createComponentExtensionMethod({
        Generator,
        options: processOptions(componentOptions, language)
    });

    const colors = createColorsExtensionMethod({
        Generator,
        options: processOptions(colorsOptions, language)
    });

    const textStyles = createTextStylesExtenionMethod({
        Generator,
        options: processOptions(textStylesOptions)
    });

    const spacing = createSpacingExtensionMethod({
        Generator,
        options: processOptions(spacingOptions)
    });

    const layer = createLayerExtensionMethod({
        Generator,
        options: processOptions(layerOptions)
    });

    const exportColors = exportColorsExtensionMethod({
        baseMethod: colors,
        options: processOptions(exportColorsOptions)
    });

    const exportTextStyles = exportTextStylesExtensionMethod({
        baseMethod: textStyles,
        options: processOptions(exportTextStylesOptions)
    });

    const exportSpacing = createExportSpacingExtensionMethod({
        baseMethod: spacing,
        options: processOptions(exportSpacingOptions)
    });

    const styleguideColors = createColorsExtensionMethod({
        Generator,
        options: processOptions(colorsOptions)
    });

    const styleguideTextStyles = createTextStylesExtenionMethod({
        Generator,
        options: processOptions(textStylesOptions)
    });

    const exportStyleguideColors = exportColorsExtensionMethod({
        baseMethod: styleguideColors,
        options: processOptions(exportColorsOptions)
    });

    const exportStyleguideTextStyles = exportTextStylesExtensionMethod({
        baseMethod: styleguideTextStyles,
        options: processOptions(exportTextStylesOptions)
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
