import { createExtension } from "base-extension";

import { LessGenerator } from "./LessGenerator.js";
import { COPYRIGHT } from "./constants.js";

const exportPrefix = `${COPYRIGHT}\n\n`;

const INDENTATION = "  ";

export default createExtension({
    language: "less",
    Generator: LessGenerator,
    colorsOptions: {
        colorVariablePrefix: `.modeName {\n${INDENTATION}`,
        colorVariableSeparator: `\n${INDENTATION}`,
        colorVariableSuffix: "\n}"
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
