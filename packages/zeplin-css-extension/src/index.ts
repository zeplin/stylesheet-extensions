import { createExtension } from "base-extension";

import { CSSGenerator } from "./CSSGenerator.js";
import { COPYRIGHT } from "./constants.js";

const exportPrefix = `${COPYRIGHT}\n\n`;

const INDENTATION = "  ";

export default createExtension({
    language: "css",
    Generator: CSSGenerator,
    colorsOptions: {
        blockCodeOptions: {
            prefix: `:root {\n${INDENTATION}`,
            separator: `\n${INDENTATION}`,
            suffix: "\n}",
        },
        colorVariablePrefix: `.modeName {\n${INDENTATION}`,
        colorVariableSeparator: `\n${INDENTATION}`,
        colorVariableSuffix: "\n}"
    },
    spacingOptions: {
        blockCodeOptions: {
            prefix: `:root {\n${INDENTATION}`,
            separator: `\n${INDENTATION}`,
            suffix: "\n}"
        }
    },
    exportTextStylesOptions: {
        blockCodeOptions: {
            prefix: exportPrefix
        }
    },
    exportColorsOptions: {
        blockCodeOptions: {
            prefix: exportPrefix
        }
    },
    exportSpacingOptions: {
        blockCodeOptions: {
            prefix: exportPrefix
        }
    }
});
