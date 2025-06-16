import { createExtension } from "base-extension";
import { SassGenerator } from "./SassGenerator.js";
import { COPYRIGHT } from "./constants.js";

const exportPrefix = `${COPYRIGHT}\n\n`;

const INDENTATION = "  ";

export default createExtension({
    language: "sass",
    Generator: SassGenerator,
    colorsOptions: {
        variablePrefix: `.modeName \n${INDENTATION}`,
        variableSeparator: `\n${INDENTATION}`,
        variableSuffix: "\n"
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
