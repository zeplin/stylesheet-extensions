import { createExtension } from "base-extension";
import { SassGenerator } from "./SassGenerator.js";
import { COPYRIGHT } from "./constants.js";

const exportPrefix = `${COPYRIGHT}\n\n`;

const INDENTATION = "  ";

export default createExtension({
    language: "sass",
    Generator: SassGenerator,
    colorsOptions: {
        colorVariablePrefix: `.modeName \n${INDENTATION}`,
        colorVariableSeparator: `\n${INDENTATION}`,
        colorVariableSuffix: "\n"
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
