import Color from "zeplin-extension-style-kit/values/color";
import { getResources, generateIdentifier, getUniqueFirstItems } from "zeplin-extension-style-kit/utils";
import { colorCodeGenerator } from "./codeGenerators/color";
import { layerCodeGenerator } from "./codeGenerators/layer";
import { spacingCodeGenerator } from "./codeGenerators/spacing";
import { textStyleCodeGenerator } from "./codeGenerators/textStyle";
import { componentCodeGenerator } from "./codeGenerators/component";

const comment = (context, text) => `/* ${text} */`;

const exportColorsGenerator = ({
    colors,
    options: {
        prefix = "",
        suffix = ""
    } = {}
}) => (context, colorsParam) => {
    const { code, language } = colors(context, colorsParam);
    return {
        code: `${prefix}${code}${suffix}`,
        filename: `colors.${language}`,
        language
    };
};

const exportTextStylesGenerator = ({
    textStyles,
    options: {
        prefix = "",
        suffix = ""
    } = {}
}) => (context, textStylesParam) => {
    const { code, language } = textStyles(context, textStylesParam);
    return {
        code: `${prefix}${code}${suffix}`,
        filename: `fonts.${language}`,
        language
    };
};

const exportSpacingGenerator = ({
    spacing,
    options: {
        prefix = "",
        suffix = ""
    } = {}
}) => context => {
    const { code, language } = spacing(context);
    return {
        code: `${prefix}${code}${suffix}`,
        filename: `spacing.${language}`,
        language
    };
};

export const createExtension = ({
    language,
    Generator,
    colorsOptions,
    textStylesOptions,
    spacingOptions,
    layerOptions,
    componentOptions,
    exportColorsOptions,
    exportTextStylesOptions,
    exportSpacingOptions
}) => {
    const getVariableMap = containerColors => {
        const variables = {};

        containerColors.forEach(containerColor => {
            // Colors are sorted by their priorities; so, we don't override already set colors
            const colorValue = new Color(containerColor).valueOf();
            variables[colorValue] = variables[colorValue] ? variables[colorValue] : containerColor.name;
        });

        return variables;
    };

    const createGenerator = (context, params) => {
        const containerColors = getResources({ context, useLinkedStyleguides: params.useLinkedStyleguides, key: "colors" });
        const uniqueColors = getUniqueFirstItems(containerColors,
            (color, other) => generateIdentifier(color.name) === generateIdentifier(other.name)
        );

        return new Generator(getVariableMap(uniqueColors), params);
    };

    const component = componentCodeGenerator({ language, createGenerator, options: componentOptions });
    const colors = colorCodeGenerator({ language, createGenerator, options: colorsOptions });
    const textStyles = textStyleCodeGenerator({ language, createGenerator, options: textStylesOptions });
    const spacing = spacingCodeGenerator({ language, createGenerator, options: spacingOptions });
    const layer = layerCodeGenerator({ language, createGenerator, options: layerOptions });
    const exportColors = exportColorsGenerator({ colors, options: exportColorsOptions });
    const exportTextStyles = exportTextStylesGenerator({ textStyles, options: exportTextStylesOptions });
    const exportSpacing = exportSpacingGenerator({ spacing, options: exportSpacingOptions });
    const styleguideColors = colorCodeGenerator({
        language,
        createGenerator,
        options: colorsOptions,
        isColorsFromParam: true
    });
    const styleguideTextStyles = textStyleCodeGenerator({
        language,
        createGenerator,
        options: textStylesOptions,
        isTextStylesFromParam: true
    });
    const exportStyleguideColors = exportColorsGenerator({ colors: styleguideColors, options: exportColorsOptions });
    const exportStyleguideTextStyles = exportTextStylesGenerator({
        textStyles: styleguideTextStyles,
        options: exportTextStylesOptions
    });

    return {
        component,
        colors,
        textStyles,
        spacing,
        layer,
        comment,
        exportColors,
        exportTextStyles,
        exportSpacing,
        styleguideColors,
        styleguideTextStyles,
        exportStyleguideColors,
        exportStyleguideTextStyles
    };
};
