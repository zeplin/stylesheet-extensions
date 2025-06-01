import { Context } from "@zeplin/extension-model";
import {
    ExtensionMethodCreator,
    ExtensionMethodReturnType,
    generateIdentifier,
    getParams,
    getResourceContainer,
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
            language,
            Generator,
            options: {
                prefix = "",
                separator = "\n",
                suffix = ""
            } = {}
        } = generatorParams;
        const params = getParams(context);
        const { container } = getResourceContainer(context);
        const generator = new Generator(container, params);

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
            language
        };
    };
