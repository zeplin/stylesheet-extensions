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
    const component = componentCodeGenerator({ language, Generator, options: componentOptions });
    const colors = colorCodeGenerator({ language, Generator, options: colorsOptions });
    const textStyles = textStyleCodeGenerator({ language, Generator, options: textStylesOptions });
    const spacing = spacingCodeGenerator({ language, Generator, options: spacingOptions });
    const layer = layerCodeGenerator({ language, Generator, options: layerOptions });
    const exportColors = exportColorsGenerator({ colors, options: exportColorsOptions });
    const exportTextStyles = exportTextStylesGenerator({ textStyles, options: exportTextStylesOptions });
    const exportSpacing = exportSpacingGenerator({ spacing, options: exportSpacingOptions });
    const styleguideColors = colorCodeGenerator({ language, options: colorsOptions, isColorsFromParam: true });
    const styleguideTextStyles = textStyleCodeGenerator({
        language,
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
