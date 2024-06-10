import Color from "zeplin-extension-style-kit/values/color";
import {
    generateIdentifier,
    getResources,
    getParams,
    getResourceContainer,
    generateColorDetailsByModeName
} from "zeplin-extension-style-kit/utils";

const MODE_SEPARATOR = "\n\n";
const COMMENT_START = "/* ";
const COMMENT_END = " */";

export const colorCodeGenerator = ({
    language,
    Generator,
    options: {
        prefix = "",
        separator = "\n",
        suffix = "",
        variablePrefix = "",
        variableSeparator = "\n",
        variableSuffix = ""
    } = {},
    isColorsFromParam
}) => (context, colorsParam) => {
    const params = getParams(context);
    const { container } = getResourceContainer(context);
    const generator = new Generator(container, params);

    const allColors = isColorsFromParam
        ? colorsParam
        : getResources({ context, useLinkedStyleguides: params.useLinkedStyleguides, key: "colors" });

    const colorsCode = allColors.filter(color => !color.isVariable).map(
        color => generator.variable(color.originalName || color.name, new Color(color))
    ).join(separator);

    const variableCollections = getResources(
        { context, useLinkedStyleguides: params.useLinkedStyleguides, key: "variableCollections" }
    );

    const colorDetailsByModeName = generateColorDetailsByModeName(variableCollections);

    let colorVariablesCode = "";
    for (const [modeName, colorDetails] of Object.entries(colorDetailsByModeName || {})) {
        let variables = [];
        let colorSectionName;
        for (const { color, shouldDisplayDefaultValue } of colorDetails) {
            const adjustedColorSectionName = color.originalName.replace(/\/[^/]*$/, "").replace(/\//g, " / ");

            if (colorSectionName !== adjustedColorSectionName) {
                variables.push(
                    `${colorSectionName
                        ? variableSeparator
                        : ""
                    }${COMMENT_START}${adjustedColorSectionName}${COMMENT_END}`
                );

                colorSectionName = adjustedColorSectionName;
            }

            variables.push(
                generator.variable(color.originalName || color.name, new Color(color, shouldDisplayDefaultValue))
            );
        }

        const variableName = variables.join(variableSeparator);
        const prefixForMode = variablePrefix.replace("modeName", generateIdentifier(modeName));

        colorVariablesCode += `${MODE_SEPARATOR}${prefixForMode}${variableName}${variableSuffix}`;
    }

    const code = `${prefix}${colorsCode}${suffix}${colorVariablesCode}`;

    return {
        code,
        language
    };
};
