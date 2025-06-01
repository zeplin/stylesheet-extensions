import { createExtension } from "base-extension";

import { CSSGenerator } from "./generator.js";
import { COPYRIGHT } from "./constants.js";

const exportPrefix = `${COPYRIGHT}\n\n`;

const INDENTATION = "  ";

export default createExtension({
    language: "css",
    Generator: CSSGenerator,
    colorsOptions: {
        prefix: `:root {\n${INDENTATION}`,
        separator: `\n${INDENTATION}`,
        suffix: "\n}",
        variablePrefix: `.modeName {\n${INDENTATION}`,
        variableSeparator: `\n${INDENTATION}`,
        variableSuffix: "\n}"
    },
    spacingOptions: {
        prefix: `:root {\n${INDENTATION}`,
        separator: `\n${INDENTATION}`,
        suffix: "\n}"
    },
    exportTextStylesOptions: {
        prefix: exportPrefix
    },
    exportColorsOptions: {
        prefix: exportPrefix
    },
    exportSpacingOptions: {
        prefix: exportPrefix
    }
});
