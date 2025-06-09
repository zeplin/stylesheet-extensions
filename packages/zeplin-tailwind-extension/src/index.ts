import { createExtension } from "base-extension";

import { TailwindGenerator } from "./TailwindGenerator.js";
import { COPYRIGHT } from "./constants.js";
import { createExportSingleSpacingExtensionMethod, createSingleSpacingExtensionMethod } from "./single-spacing.js";
import { TailwindMapper } from "./mapper/TailwindMapper.js";


const exportPrefix = `${COPYRIGHT}\n\n`;

const INDENTATION = "  ";

const extension = createExtension({
    language: "html",
    Generator: TailwindGenerator,
    colorsOptions: {
        declarationBlockOptions: {
            prefix: `@theme {\n${INDENTATION}`,
            separator: `\n${INDENTATION}`,
            suffix: "\n}",
        },
        declarationOptions: {
            namePrefix: "--color-",
            valueSuffix: `;`,
            nameValueSeparator: `: `,
        },
        language: "css"
    },
    layerOptions: {
        language: "html",
        layerSuffix: "\">\n</div>",
        layerPrefix: "<div class=\"",
        declarationBlockOptions: {
            separator: " " // whitespace
        },
        declarationOptions: {
            wrapperPrefix: "",
            wrapperSuffix: "",
            declarationMapper: TailwindMapper
        },
    },
    textStylesOptions: {
        language: "css"
    },
    exportTextStylesOptions: {
        declarationBlockOptions: {
            prefix: exportPrefix
        }
    },
    exportColorsOptions: {
        declarationBlockOptions: {
            prefix: exportPrefix
        }
    }
});

// Override base-extension components to handle Tailwind's special case
extension.spacing = createSingleSpacingExtensionMethod({
    Generator: TailwindGenerator,
    options: {
        declarationBlockOptions: {
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

export default extension;