import { Context } from "@zeplin/extension-model";
import {
    ExtensionMethod,
    ExtensionMethodCreator,
    ExtensionMethodReturnType,
    getParams,
    getResources,
    Length
} from "zeplin-extension-style-kit";
import { getMinimumSpacingValue } from "./util.js";

type MethodName = "spacing";
export const createSingleSpacingExtensionMethod: ExtensionMethodCreator<MethodName> = (generatorParams) =>
    (context: Context): ExtensionMethodReturnType<MethodName> => {
        const {
            Generator,
            options: {
                language,
                declarationOptions,
                declarationBlockOptions: {
                    prefix = "",
                    suffix = ""
                } = {}
            } = {}
        } = generatorParams;
        const params = getParams(context);
        const generator = new Generator(context, params, declarationOptions);

        const minimumSpacingValue = getMinimumSpacingValue(container);

        const code = `${prefix}${
            generator.variable(
                "spacing",
                new Length(minimumSpacingValue || 1))
        }${suffix}`;

        return {
            code,
            language: language!
        };
    };


export const createExportSingleSpacingExtensionMethod =
    (spacingMethod: ExtensionMethod<"spacing">, options: { prefix?: string; suffix?: string; } = {}) =>
        (context: Context): ExtensionMethodReturnType<"exportSpacing"> => {
            const {
                prefix = "",
                suffix = ""
            } = options;
            const { code, language } = spacingMethod(context);
            return {
                code: `${prefix}${code}${suffix}`,
                filename: `spacing.${language}`,
                language
            };
        };

