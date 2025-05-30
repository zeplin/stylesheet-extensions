import { Component, Context, Version } from "@zeplin/extension-model";
import {
    CodeGenerator,
    CodeGeneratorParams,
    CodeOutput,
    getParams,
    getResourceContainer
} from "zeplin-extension-style-kit";
import { ComponentCodeGenerator } from "./componentCodeGenerator";
import { fixVariantPropertyOrder } from "./componentUtils";

export const componentCodeGenerator: CodeGenerator = (params: CodeGeneratorParams) => {
    const {
        language,
        Generator,
        options: {
            separator = "\n\n"
        } = {}
    } = params;

    return (context: Context, _: Version, component: Component): CodeOutput => {
        const params = getParams(context);

        const { container } = getResourceContainer(context);
        const generator = new Generator(container, params);

        if (component.variant) {
            fixVariantPropertyOrder(component);
        }

        const componentGenerator = new ComponentCodeGenerator({
            generator,
            language,
            lineSeparator: separator
        });

        return componentGenerator.generate(component);
    };
};
