import {
    Context,
    TextStyle as ExtenstionTextStyle,
} from "@zeplin/extension-model";
import {
    CodeGenerator,
    CodeGeneratorOptions,
    CodeGeneratorParams,
    FontFace,
    TextStyle,
    generateIdentifier,
    getFontFaces,
    getParams,
    getResourceContainer,
    getResources,
    getUniqueFirstItems,
} from "zeplin-extension-style-kit";

export type TextStyleCodeGeneratorOptions = CodeGeneratorOptions & {
    prefix?: string,
    separator?: string,
    fontFaceSeparator?: string,
    textStyleSeparator?: string,
    suffix?: string
};

export type TextStyleCodeGeneratorParams = CodeGeneratorParams & {
    options?: TextStyleCodeGeneratorOptions,
    isTextStylesFromParam?: boolean;
};

export const textStyleCodeGenerator: CodeGenerator<TextStyleCodeGeneratorParams> = (generatorParams: TextStyleCodeGeneratorParams) =>
    (context: Context, textStylesParam: ExtenstionTextStyle[]) => {
        const {
            language,
            Generator,
            options: {
                prefix = "",
                separator = "\n\n",
                fontFaceSeparator = "\n\n",
                textStyleSeparator = "\n\n",
                suffix = ""
            } = {},
            isTextStylesFromParam
        } = generatorParams;

        const params = getParams(context);
        const { container } = getResourceContainer(context);
        const generator = new Generator(container, params);
        const textStyles = isTextStylesFromParam
            ? textStylesParam
            : getResources({
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
            language
        };
    };
