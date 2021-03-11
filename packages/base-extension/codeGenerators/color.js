import Color from "zeplin-extension-style-kit/values/color";
import {
    getResources,
    getParams,
    getResourceContainer
} from "zeplin-extension-style-kit/utils";

export const colorCodeGenerator = ({
    language,
    Generator,
    options: {
        prefix = "",
        separator = "\n",
        suffix = ""
    } = {},
    isColorsFromParam
}) => (context, colorsParam) => {
    const params = getParams(context);
    const { container } = getResourceContainer(context);
    const generator = new Generator(container, params);

    const allColors = isColorsFromParam
        ? colorsParam
        : getResources({ context, useLinkedStyleguides: params.useLinkedStyleguides, key: "colors" });

    const code = `${prefix}${allColors.map(color => {
        const colorName = (
            color.getFormattedName
                ? color.getFormattedName("kebab")
                : color.name
        );
        return generator.variable(colorName, new Color(color));
    }).join(separator)}${suffix}`;

    return {
        code,
        language
    };
};
