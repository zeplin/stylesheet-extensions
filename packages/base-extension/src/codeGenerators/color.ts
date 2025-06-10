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
    variablePrefix?: string,
    /**
     * Related to Color Variables on Zeplin
     */
    variableSeparator?: string,
    /**
     * Related to Color Variables on Zeplin
     */
    variableSuffix?: string
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
                declarationBlockOptions: {
                    prefix = "",
                    separator = "\n",
                    suffix = "",
                } = {},
                declarationOptions,
                variablePrefix = "",
                variableSeparator = "\n",
                variableSuffix = ""
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

        const variableCollections = getResources({
            context,
            useLinkedStyleguides: params.useLinkedStyleguides,
            resourceFn: barrel => barrel.variableCollections
        }) as VariableCollection[];

        const colorDetailsByModeName = generateColorDetailsByModeName(variableCollections);

        let colorVariablesCode = "";
        for (const [modeName, colorDetails] of Object.entries(colorDetailsByModeName || {})) {
            let variables = [];
            let colorSectionName = null;
            for (const { color, shouldDisplayDefaultValue } of colorDetails) {
                const adjustedColorSectionName = color.originalName?.replace(/\/[^/]*$/, "").replace(/\//g, " / ");

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
                    generator.variable((color.originalName || color.name)!, new Color(color, shouldDisplayDefaultValue))
                );
            }

            const variableName = variables.join(variableSeparator);
            const prefixForMode = variablePrefix.replace("modeName", generateIdentifier(modeName));

            colorVariablesCode += `${MODE_SEPARATOR}${prefixForMode}${variableName}${variableSuffix}`;
        }

        const code = `${prefix}${colorsCode}${suffix}${colorVariablesCode}`;

        return {
            code,
            language: language!
        };
    };
