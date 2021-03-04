import FontFace from "zeplin-extension-style-kit/elements/fontFace";
import TextStyle from "zeplin-extension-style-kit/elements/textStyle";
import {
    generateIdentifier,
    getResources,
    getFontFaces,
    getParams,
    getUniqueFirstItems,
    getResourceContainer
} from "zeplin-extension-style-kit/utils";

export const textStyleCodeGenerator = ({
    language,
    Generator,
    options: {
        prefix = "",
        separator = "\n\n",
        fontFaceSeparator = separator,
        textStyleSeparator = separator,
        suffix = ""
    } = {},
    isTextStylesFromParam
}) => (context, textStylesParam) => {
    const params = getParams(context);
    const { container } = getResourceContainer(context);
    const generator = new Generator(container, params);
    const textStyles = isTextStylesFromParam
        ? textStylesParam
        : getResources({ context, useLinkedStyleguides: params.useLinkedStyleguides, key: "textStyles" });

    const uniqueTextStyles = getUniqueFirstItems(textStyles,
        (textStyle, other) => generateIdentifier(textStyle.name) === generateIdentifier(other.name));
    const fontFaces = getFontFaces(uniqueTextStyles);

    const fontFaceCode = fontFaces.map(ts => {
        const { style } = new FontFace(ts);

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
