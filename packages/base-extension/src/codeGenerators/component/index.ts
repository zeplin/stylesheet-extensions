import { Component, Context, Version } from "@zeplin/extension-model";
import {
    ExtensionMethodCreator,
    ExtensionMethodCreatorParams,
    ExtensionMethodReturnType,
    getParams
} from "zeplin-extension-style-kit";
import { ComponentCodeGenerator } from "./componentCodeGenerator.js";
import { fixVariantPropertyOrder } from "./componentUtils.js";

type MethodName = "component";

export const createComponentExtensionMethod: ExtensionMethodCreator<MethodName> = (params: ExtensionMethodCreatorParams) => {
    const {
        Generator,
        options: {
            language,
            declarationOptions,
            declarationBlockOptions: {
                separator = "\n\n"
            } = {},
        } = {}
    } = params;

    return (context: Context, _: Version, component: Component): ExtensionMethodReturnType<MethodName> => {
        const params = getParams(context);

        const generator = new Generator(context, params, declarationOptions);

        if (component.variant) {
            fixVariantPropertyOrder(component);
        }

        const componentGenerator = new ComponentCodeGenerator({
            generator,
            language: language!,
            lineSeparator: separator
        });

        return componentGenerator.generate(component);
    };
};
