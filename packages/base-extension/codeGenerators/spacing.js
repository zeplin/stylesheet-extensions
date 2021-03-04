import Length from "zeplin-extension-style-kit/values/length";
import {
    getResources,
    getParams,
    generateIdentifier,
    getUniqueFirstItems, getResourceContainer
} from "zeplin-extension-style-kit/utils";
const useRemUnitForMeasurement = ({ useForMeasurements }) => useForMeasurements;

export const spacingCodeGenerator = ({
    language,
    Generator,
    options: {
        prefix = "",
        separator = "\n",
        suffix = ""
    } = {}
}) => context => {
    const params = getParams(context);
    const { container } = getResourceContainer(context);
    const generator = new Generator(container, params);

    const spacingSections = getResources({ context, useLinkedStyleguides: params.useLinkedStyleguides, key: "spacingSections" });
    const spacingTokens = getUniqueFirstItems(
        spacingSections.map(({ spacingTokens: items }) => items).reduce((prev, current) => [...prev, ...current]),
        (token, other) => generateIdentifier(token.name) === generateIdentifier(other.name)
    );

    const code = `${prefix}${
        spacingTokens
            .map(({ name, value }) => generator.variable(
                name,
                new Length(value, { useRemUnit: useRemUnitForMeasurement, useDensityDivisor: false })),
            )
            .join(separator)
    }${suffix}`;
    return {
        code,
        language
    };
};
