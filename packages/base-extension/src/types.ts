import {
    ExtensionMethodCreator,
    ExtensionMethodCreatorParams,
    ExtensionMethodOptions
} from "zeplin-extension-style-kit";
import { Extension } from "@zeplin/extension-model";
import { ColorExtensionMethodOptions } from "./codeGenerators/color.js";
import { TextStyleExtensionMethodOptions } from "./codeGenerators/textStyle.js";
import { LayerExtensionMethodOptions } from "./codeGenerators/layer.js";

export type ExtensionCreatorParams = Pick<ExtensionMethodCreatorParams, "Generator"> & {
    language?: string;
    colorsOptions?: ColorExtensionMethodOptions,
    textStylesOptions?: TextStyleExtensionMethodOptions,
    spacingOptions?: ExtensionMethodOptions,
    layerOptions?: LayerExtensionMethodOptions,
    componentOptions?: ExtensionMethodOptions,
    exportColorsOptions?: ExtensionMethodOptions,
    exportTextStylesOptions?: ExtensionMethodOptions,
    exportSpacingOptions?: ExtensionMethodOptions;
};

export type ExtensionCreator = (params: ExtensionCreatorParams) => Extension;

export type ExportExtensionMethodCreatorParams = {
    baseMethod: ReturnType<ExtensionMethodCreator<"colors" | "textStyles" | "spacing">>
    options?: ExtensionMethodOptions
};