import {
    ExtensionMethod,
    ExtensionMethodCreator,
    ExtensionMethodCreatorParams,
    ExtensionMethodOptions
} from "zeplin-extension-style-kit";
import { ColorExtensionMethodOptions } from "./codeGenerators/color.js";
import { TextStyleExtensionMethodOptions } from "./codeGenerators/textStyle.js";

export type ExtensionCreatorParams = Omit<ExtensionMethodCreatorParams, "options"> & {
    colorsOptions?: ColorExtensionMethodOptions,
    textStylesOptions?: TextStyleExtensionMethodOptions,
    spacingOptions?: ExtensionMethodOptions,
    layerOptions?: ExtensionMethodOptions,
    componentOptions?: ExtensionMethodOptions,
    exportColorsOptions?: ExtensionMethodOptions,
    exportTextStylesOptions?: ExtensionMethodOptions,
    exportSpacingOptions?: ExtensionMethodOptions;
};

export type ExtensionCreatorOutput = {
    component: ExtensionMethod<"component">,
    colors: ExtensionMethod<"colors">,
    textStyles: ExtensionMethod<"textStyles">,
    spacing: ExtensionMethod<"spacing">,
    layer: ExtensionMethod<"layer">,
    comment: ExtensionMethod<"comment">,
    exportColors: ExtensionMethod<"exportColors">,
    exportTextStyles: ExtensionMethod<"exportTextStyles">,
    exportSpacing: ExtensionMethod<"exportSpacing">,
    styleguideColors: ExtensionMethod<"styleguideColors">,
    styleguideTextStyles: ExtensionMethod<"styleguideTextStyles">,
    exportStyleguideColors: ExtensionMethod<"exportStyleguideColors">,
    exportStyleguideTextStyles: ExtensionMethod<"exportStyleguideTextStyles">
};

export type ExtensionCreator = (params: ExtensionCreatorParams) => ExtensionCreatorOutput;

export type ExportExtensionMethodCreatorParams = {
    baseMethod: ReturnType<ExtensionMethodCreator<"colors" | "textStyles" | "spacing">>
    options?: ExtensionMethodOptions
};