import Color from "zeplin-extension-style-kit/values/color";
import {
    getResources,
    getParams,
    generateIdentifier,
    getUniqueFirstItems
} from "zeplin-extension-style-kit/utils";

export const colorCodeGenerator = ({
    language,
    createGenerator,
    options: {
        prefix = "",
        separator = "\n",
        suffix = ""
    } = {},
    isColorsFromParam
}) => (context, colorsParam) => {
    const params = getParams(context);
    const generator = createGenerator(context, params);
    const allColors = isColorsFromParam
        ? colorsParam
        : getResources({ context, useLinkedStyleguides: params.useLinkedStyleguides, key: "colors" });
    const uniqueColors = getUniqueFirstItems(allColors,
        (color, other) => generateIdentifier(color.name) === generateIdentifier(other.name)
    );
    const code = `${prefix}${uniqueColors.map(c => generator.variable(c.name, new Color(c))).join(separator)}${suffix}`;

    return {
        code,
        language
    };
};
