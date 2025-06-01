import { createColorsExtensionMethod } from "./codeGenerators/color.js";
import { createLayerExtensionMethod } from "./codeGenerators/layer.js";
import { createSpacingExtensionMethod } from "./codeGenerators/spacing.js";
import { createTextStylesExtenionMethod } from "./codeGenerators/textStyle.js";
import { createComponentExtensionMethod } from "./codeGenerators/component/index.js";
import { Context } from "@zeplin/extension-model";
import { ExtensionMethodCreator, ExtensionMethodReturnType } from "zeplin-extension-style-kit";
import { ExportExtensionMethodCreatorParams, ExtensionCreator } from "./types.js";

const comment = (_: Context, text: string) => `/* ${text} */`;

const exportColorsExtensionMethod: ExtensionMethodCreator<"exportColors", ExportExtensionMethodCreatorParams> = (
    {
        baseMethod,
        options: {
            prefix = "",
            suffix = ""
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
            prefix = "",
            suffix = ""
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
            prefix = "",
            suffix = ""
        } = {}
    }) => (context): ExtensionMethodReturnType<"exportSpacing"> => {
    const { code, language } = baseMethod(context);
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
    const component = createComponentExtensionMethod({ language, Generator, options: componentOptions });
    const colors = createColorsExtensionMethod({ language, Generator, options: colorsOptions });
    const textStyles = createTextStylesExtenionMethod({ language, Generator, options: textStylesOptions });
    const spacing = createSpacingExtensionMethod({ language, Generator, options: spacingOptions });
    const layer = createLayerExtensionMethod({ language, Generator, options: layerOptions });

    const exportColors = exportColorsExtensionMethod({
        baseMethod: colors,
        options: exportColorsOptions
    });
    const exportTextStyles = exportTextStylesExtensionMethod({
        baseMethod: textStyles,
        options: exportTextStylesOptions
    });
    const exportSpacing = createExportSpacingExtensionMethod({
        baseMethod: spacing,
        options: exportSpacingOptions
    });

    const styleguideColors = createColorsExtensionMethod({
        language,
        Generator,
        options: colorsOptions
    });
    const styleguideTextStyles = createTextStylesExtenionMethod({
        language,
        Generator,
        options: textStylesOptions
    });

    const exportStyleguideColors = exportColorsExtensionMethod({
        baseMethod: styleguideColors,
        options: exportColorsOptions
    });

    const exportStyleguideTextStyles = exportTextStylesExtensionMethod({
        baseMethod: styleguideTextStyles,
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
