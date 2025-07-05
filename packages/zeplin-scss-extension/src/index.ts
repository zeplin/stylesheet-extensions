import { createExtension } from "base-extension";
import { ScssGenerator } from "./ScssGenerator.js";
import { COPYRIGHT } from "./constants.js";

const exportPrefix = `${COPYRIGHT}\n\n`;

const INDENTATION = "  ";

export default createExtension({
    language: "scss",
    Generator: ScssGenerator,
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
