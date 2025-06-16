import { Barrel, Context } from "@zeplin/extension-model";
import {
    ExtensionMethod,
    ExtensionMethodCreator,
    ExtensionMethodCreatorParams,
    ExtensionMethodOptions,
    ExtensionMethodReturnType,
    FontFamily,
    FontSize,
    FontWeight,
    generateColorNameResolver,
    generateIdentifier,
    generateVariableName,
    getParams,
    getResourceContainer,
    getResources,
    getUniqueFirstItems,
    Length,
} from "zeplin-extension-style-kit";
import { TailwindMapper } from "./mapper/TailwindMapper.js";
import { getMinimumSpacingValue, getValueInPixels } from "./util.js";

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
            options: {
                language,
                declarationOptions,
                declarationBlockOptions: {
                    prefix = "",
                    separator = "\n\n",
                    suffix = ""
                } = {},
            } = {}
        } = generatorParams;

        const params = getParams(context);
        const textStyles = getResources({
            context,
            useLinkedStyleguides: params.useLinkedStyleguides,
            resourceFn: barrel => barrel.textStyles
        });

        const uniqueTextStyles = getUniqueFirstItems(textStyles,
            (textStyle, other) => generateIdentifier(textStyle.name) === generateIdentifier(other.name));

        const fontFamilies = Array.from(new Set(uniqueTextStyles.map(ts => ts.fontFamily)))
            .map(ff => new FontFamily(ff));
        const fontWeights = Array.from(new Set(uniqueTextStyles.map(ts => ts.fontWeight)))
            .map(fw => new FontWeight(fw));
        const fontSizes = Array.from(new Set(uniqueTextStyles.map(ts => ts.fontSize))).sort()
            .map(fs => new FontSize(new Length(fs)));

        const colorNameResolver = generateColorNameResolver({
            container: getResourceContainer(context).container,
            useLinkedStyleguides: params.useLinkedStyleguides,
            formatVariableName: color => generateVariableName(color.originalName || color.name!, params.variableNameFormat).toLowerCase()
        });

        const spacingSections = getResources({
            context,
            useLinkedStyleguides: params.useLinkedStyleguides,
            resourceFn: (b: Barrel) => b.spacingSections
        });

        const mapper = new TailwindMapper({
            params,
            colorNameResolver,
            spacingValue: getMinimumSpacingValue(spacingSections)
        });

        const {
            namePrefix = "--",
            valueSuffix = ";",
            nameValueSeparator = ": "
        } = declarationOptions!;

        const declarations = [
            `/* Font families */`,
            ...fontFamilies.map(ff => `${namePrefix}${mapper.mapValue(ff)}${nameValueSeparator}${ff.getValue()}${valueSuffix}`),
            `/* Font weights */`,
            ...fontWeights.map(fw => `${namePrefix}${mapper.mapValue(fw)}${nameValueSeparator}${fw.getValue()}${valueSuffix}`),
            `/* Font sizes */`,
            ...fontSizes.map(fs => `${namePrefix}text-${getValueInPixels(fs.getValue(params), params)}${nameValueSeparator}${fs.getValue(params)}${valueSuffix}`)
        ].join(separator);

        return {
            code: `${prefix}${declarations}${suffix}`,
            language: language!
        };
    };

export const createExportTextStylesExtensionMethod =
    (textStylesMethod: ExtensionMethod<"textStyles">, options: { prefix?: string; suffix?: string; } = {}) =>
        (context: Context): ExtensionMethodReturnType<"exportTextStyles"> => {
            const {
                prefix = "",
                suffix = ""
            } = options;
            const { code, language } = textStylesMethod(context);
            return {
                code: `${prefix}${code}${suffix}`,
                filename: `fonts.${language}`,
                language
            };
        };