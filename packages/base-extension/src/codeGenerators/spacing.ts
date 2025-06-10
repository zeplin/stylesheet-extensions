import { Context } from "@zeplin/extension-model";
import {
    ExtensionMethodCreator,
    ExtensionMethodReturnType,
    generateIdentifier,
    getParams,
    getResources,
    getUniqueFirstItems,
    Length,
    RemPreferences
} from "zeplin-extension-style-kit";

const useRemUnitForMeasurement = ({ useForMeasurements }: RemPreferences) => useForMeasurements;

type MethodName = "spacing";

export const createSpacingExtensionMethod: ExtensionMethodCreator<MethodName> = (generatorParams) =>
    (context: Context): ExtensionMethodReturnType<MethodName> => {
        const {
            Generator,
            options: {
                language,
                declarationOptions,
                declarationBlockOptions: {
                    prefix = "",
                    separator = "\n",
                    suffix = ""
                } = {}
            } = {}
        } = generatorParams;
        const params = getParams(context);
        const generator = new Generator(context, params, declarationOptions);

        const spacingSections = getResources({
            context,
            useLinkedStyleguides: params.useLinkedStyleguides,
            resourceFn: barrel => barrel.spacingSections,
        });
        const spacingTokens = getUniqueFirstItems(
            spacingSections.map(({ spacingTokens: items }) => items).reduce((prev, current) => [...prev, ...current]),
            (token, other) => generateIdentifier(token.name) === generateIdentifier(other.name)
        );

        const code = `${prefix}${
            spacingTokens
                .map(({ name, value }) => generator.variable(
                    name,
                    new Length(value, { useRemUnit: useRemUnitForMeasurement, useDensityDivisor: false }))
                )
                .join(separator)
        }${suffix}`;

        return {
            code,
            language: language!
        };
    };
