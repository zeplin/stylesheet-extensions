import Length from "zeplin-extension-style-kit/values/length";
import {
    getResources,
    getParams,
    generateIdentifier,
    getUniqueFirstItems
} from "zeplin-extension-style-kit/utils";
const useRemUnitForMeasurement = ({ useForMeasurements }) => useForMeasurements;

export const spacingCodeGenerator = ({
    language,
    createGenerator,
    options: {
        prefix = "",
        separator = "\n",
        suffix = ""
    } = {}
}) => context => {
    const params = getParams(context);
    const cssGenerator = createGenerator(context, params);
    const spacingSections = getResources({ context, useLinkedStyleguides: params.useLinkedStyleguides, key: "spacingSections" });
    const spacingTokens = getUniqueFirstItems(
        spacingSections.map(({ spacingTokens: items }) => items).reduce((prev, current) => [...prev, ...current]),
        (token, other) => generateIdentifier(token.name) === generateIdentifier(other.name)
    );

    const code = `${prefix}${
        spacingTokens
            .map(({ name, value }) => cssGenerator.variable(
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