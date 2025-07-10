import { Context, VariableCollection } from "@zeplin/extension-model";
import {
    Color,
    ExtensionMethodCreator,
    ExtensionMethodCreatorParams,
    ExtensionMethodOptions,
    ExtensionMethodReturnType,
    generateColorDetailsByModeName,
    generateIdentifier,
    getParams,
    getResources
} from "zeplin-extension-style-kit";

const MODE_SEPARATOR = "\n\n";
const COMMENT_START = "/* ";
const COMMENT_END = " */";

export type ColorExtensionMethodOptions = ExtensionMethodOptions & {
    /**
     * Related to Color Variables on Zeplin
     */
    colorVariablePrefix?: string,
    /**
     * Related to Color Variables on Zeplin
     */
    colorVariableSeparator?: string,
    /**
     * Related to Color Variables on Zeplin
     */
    colorVariableSuffix?: string
};

export type ColorCodeGeneratorParams = ExtensionMethodCreatorParams & {
    options?: ColorExtensionMethodOptions
}

type MethodName = "colors";

export const createColorsExtensionMethod: ExtensionMethodCreator<MethodName> = (generatorParams: ColorCodeGeneratorParams) =>
    (context: Context): ExtensionMethodReturnType<MethodName> => {
        const {
            Generator,
            options: {
                language,
                fullCodeOptions: {
                    prefix: fullCodePrefix = "",
                    suffix: fullCodeSuffix = "",
                } = {},
                blockCodeOptions: {
                    prefix = "",
                    separator = "\n",
                    suffix = "",
                } = {},
                declarationOptions,
                colorVariablePrefix = "",
                colorVariableSeparator = "\n",
                colorVariableSuffix = ""
            } = {}
        } = generatorParams;

        const params = getParams(context);
        const generator = new Generator(context, params, declarationOptions);

        const allColors = getResources({
            context,
            useLinkedStyleguides: params.useLinkedStyleguides,
            resourceFn: barrel => barrel.colors
        });

        const colorsCode = allColors.filter(color => !color.isVariable).map(
            color => generator.variable((color.originalName || color.name)!, new Color(color))
        ).join(separator);

        const colorsBlockCode = `${prefix}${colorsCode}${suffix}`;

        const variableCollections = getResources({
            context,
            useLinkedStyleguides: params.useLinkedStyleguides,
            resourceFn: barrel => barrel.variableCollections
        }) as VariableCollection[];

        const colorDetailsByModeName = generateColorDetailsByModeName(variableCollections);

        let colorVariablesBlockCode = "";
        for (const [modeName, colorDetails] of Object.entries(colorDetailsByModeName || {})) {
            const variables = [];
            let colorSectionName = null;
            for (const { color, shouldDisplayDefaultValue } of colorDetails) {
                const adjustedColorSectionName = color.originalName?.replace(/\/[^/]*$/, "").replace(/\//g, " / ");

                if (colorSectionName !== adjustedColorSectionName) {
                    variables.push(
                        `${colorSectionName
                            ? colorVariableSeparator
                            : ""
                        }${COMMENT_START}${adjustedColorSectionName}${COMMENT_END}`
                    );

                    colorSectionName = adjustedColorSectionName;
                }

                variables.push(
                    generator.variable((color.originalName || color.name)!, new Color(color, shouldDisplayDefaultValue))
                );
            }

            const joinedVariables = variables.join(colorVariableSeparator);
            const prefixForMode = colorVariablePrefix.replace("modeName", generateIdentifier(modeName));

            colorVariablesBlockCode += `${MODE_SEPARATOR}${prefixForMode}${joinedVariables}${colorVariableSuffix}`;
        }

        const code = `${fullCodePrefix}${colorsBlockCode}${colorVariablesBlockCode}${fullCodeSuffix}`;

        return {
            code,
            language: language!
        };
    };
