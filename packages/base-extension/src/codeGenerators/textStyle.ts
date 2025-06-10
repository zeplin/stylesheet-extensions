import { Context } from "@zeplin/extension-model";
import {
    ExtensionMethodCreator,
    ExtensionMethodCreatorParams,
    ExtensionMethodOptions,
    ExtensionMethodReturnType,
    FontFace,
    generateIdentifier,
    getFontFaces,
    getParams,
    getResources,
    getUniqueFirstItems,
    TextStyle,
} from "zeplin-extension-style-kit";

export type TextStyleExtensionMethodOptions = ExtensionMethodOptions & {
    prefix?: string,
    separator?: string,
    fontFaceSeparator?: string,
    textStyleSeparator?: string,
    suffix?: string
};

export type TextStyleExtensionMethodParams = ExtensionMethodCreatorParams & {
    options?: TextStyleExtensionMethodOptions
};

type MethodName = "textStyles";

export const createTextStylesExtenionMethod: ExtensionMethodCreator<MethodName, TextStyleExtensionMethodParams> = (generatorParams: TextStyleExtensionMethodParams) =>
    (context: Context): ExtensionMethodReturnType<MethodName> => {
        const {
            Generator,
            options: {
                language,
                declarationOptions,
                declarationBlockOptions: {
                    prefix = "",
                    separator = "\n\n",
                    suffix = ""
                } = {},
                fontFaceSeparator = "\n\n",
                textStyleSeparator = "\n\n",
            } = {}
        } = generatorParams;

        const params = getParams(context);
        const generator = new Generator(context, params, declarationOptions);
        const textStyles = getResources({
            context,
            useLinkedStyleguides: params.useLinkedStyleguides,
            resourceFn: barrel => barrel.textStyles
        });

        const uniqueTextStyles = getUniqueFirstItems(textStyles,
            (textStyle, other) => generateIdentifier(textStyle.name) === generateIdentifier(other.name));
        const fontFaces = getFontFaces(uniqueTextStyles);

        const fontFaceCode = fontFaces.map(ts => {
            const { style } = new FontFace(ts.font);

            return generator.atRule(style);
        }).join(fontFaceSeparator);

        const textStyleCode = uniqueTextStyles.map(t => {
            const { style } = new TextStyle(t);

            return generator.ruleSet(style, { mixin: params.useMixin });
        }).join(textStyleSeparator);

        return {
            code: `${prefix}${fontFaceCode}${separator}${textStyleCode}${suffix}`,
            language: language!
        };
    };
