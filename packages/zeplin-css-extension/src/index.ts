import { createExtension } from "base-extension";

import { CSSGenerator } from "./CSSGenerator.js";
import { COPYRIGHT } from "./constants.js";

const exportPrefix = `${COPYRIGHT}\n\n`;

const INDENTATION = "  ";

export default createExtension({
    language: "css",
    Generator: CSSGenerator,
    colorsOptions: {
        declarationBlockOptions: {
            prefix: `:root {\n${INDENTATION}`,
            separator: `\n${INDENTATION}`,
            suffix: "\n}",
        },
        variablePrefix: `.modeName {\n${INDENTATION}`,
        variableSeparator: `\n${INDENTATION}`,
        variableSuffix: "\n}"
    },
    spacingOptions: {
        declarationBlockOptions: {
            prefix: `:root {\n${INDENTATION}`,
            separator: `\n${INDENTATION}`,
            suffix: "\n}"
        }
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
    },
    exportSpacingOptions: {
        declarationBlockOptions: {
            prefix: exportPrefix
        }
    }
});
