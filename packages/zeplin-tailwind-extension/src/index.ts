import { createExtension } from "base-extension";

import { TailwindGenerator } from "./TailwindGenerator.js";
import { COPYRIGHT } from "./constants.js";
import { createExportSingleSpacingExtensionMethod, createSingleSpacingExtensionMethod } from "./single-spacing.js";
import { createExportTextStylesExtensionMethod, createTextStylesExtenionMethod } from "./textStyle.js";
import { TailwindMapper } from "./mapper/TailwindMapper.js";
import { Layer } from "@zeplin/extension-model";

const exportPrefix = `${COPYRIGHT}\n\n`;

const INDENTATION = "  ";

const extension = createExtension({
    language: "html",
    Generator: TailwindGenerator,
    colorsOptions: {
        fullCodeOptions: {
            prefix: `@theme {\n${INDENTATION}--color-*: initial;\n${INDENTATION}`,
            suffix: "\n}",
        },
        blockCodeOptions: {
            separator: `\n${INDENTATION}`
        },
        declarationOptions: {
            namePrefix: "--color-",
            valueSuffix: `;`,
            nameValueSeparator: `: `,
        },
        colorVariablePrefix: `${INDENTATION}`,
        colorVariableSeparator: `\n${INDENTATION}`,
        language: "css"
    },
    layerOptions: {
        language: "html",
        layerSuffix: (layer: Layer) => {
            const tag = layer.type === "text" ? "p" : "div";
            return `">\n</${tag}>`;
        },
        layerPrefix: (layer: Layer) => {
            const tag = layer.type === "text" ? "p" : "div";
            return `<${tag} class="`;
        },
        blockCodeOptions: {
            separator: " " // whitespace
        },
        declarationOptions: {
            namePrefix: "",
            nameSuffix: "",
            valuePrefix: "",
            valueSuffix: "",
            wrapperPrefix: "",
            wrapperSuffix: "",
            useRuleSetName: false,
            declarationMapper: TailwindMapper
        },
    },
    exportColorsOptions: {
        blockCodeOptions: {
            prefix: exportPrefix
        }
    }
});

// Override base-extension components to handle Tailwind's special case
extension.spacing = createSingleSpacingExtensionMethod({
    Generator: TailwindGenerator,
    options: {
        blockCodeOptions: {
            prefix: `@theme {\n${INDENTATION}`,
            separator: `\n${INDENTATION}`,
            suffix: "\n}",
        },
        declarationOptions: {
            namePrefix: "--",
            valueSuffix: `;`,
            nameValueSeparator: `: `,
        },
        language: "css"
    }
});

extension.exportSpacing = createExportSingleSpacingExtensionMethod(extension.spacing, {
    prefix: exportPrefix
});

extension.textStyles = createTextStylesExtenionMethod({
    Generator: TailwindGenerator,
    options: {
        blockCodeOptions: {
            prefix: `@theme {\n${INDENTATION}`,
            separator: `\n${INDENTATION}`,
            suffix: "\n}",
        },
        declarationOptions: {
            namePrefix: "--",
            valueSuffix: `;`,
            nameValueSeparator: `: `,
        },
        language: "css"
    },
});

extension.exportTextStyles = createExportTextStylesExtensionMethod(extension.textStyles, {
    prefix: exportPrefix
});

export default extension;