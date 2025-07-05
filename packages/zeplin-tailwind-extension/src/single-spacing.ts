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

const COMMENT = "/* Using smallest spacing token as the variable. */";
const INDENTATION = "  ";

export const createSingleSpacingExtensionMethod: ExtensionMethodCreator<MethodName> = (generatorParams) =>
    (context: Context): ExtensionMethodReturnType<MethodName> => {
        const {
            Generator,
            options: {
                language,
                declarationOptions,
                blockCodeOptions: {
                    prefix = "",
                    suffix = ""
                } = {}
            } = {}
        } = generatorParams;
        const params = getParams(context);
        const generator = new Generator(context, params, declarationOptions);

        const spacingSections = getResources({
            context,
            useLinkedStyleguides: params.useLinkedStyleguides,
            resourceFn: barrel => barrel.spacingSections,
        });

        const minimumSpacingValue = getMinimumSpacingValue(spacingSections);

        const code = `${prefix}${
            spacingSections.length > 1 ? `${COMMENT}\n${INDENTATION}` : ""
        }${
            generator.variable("spacing", new Length(minimumSpacingValue)
            )}${suffix}`;

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

