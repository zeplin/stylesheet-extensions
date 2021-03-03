import { getParams, getResourceContainer } from "zeplin-extension-style-kit/utils";
import { ComponentCodeGenerator } from "./componentCodeGenerator";
import { fixVariantPropertyOrder } from "./componentUtils";

export function componentCodeGenerator({
    language,
    Generator,
    options: {
        separator = "\n\n"
    } = {}
}) {
    return (context, selectedVersion, component) => {
        const params = getParams(context);

        const { container } = getResourceContainer(context);
        const generator = new Generator(container, params);

        if (component.variant) {
            fixVariantPropertyOrder(component);
        }

        const componentGenerator = new ComponentCodeGenerator(generator, {
            lineSeparator: separator,
            language
        });

        return componentGenerator.generate(component);
    };
}
