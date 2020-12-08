import { createExtension } from "base-extension";

import Generator from "./generator";
import { COPYRIGHT } from "./constants";

const exportPrefix = `${COPYRIGHT}\n\n`;

const INDENTATION =  "  ";

export default createExtension({
    language: "css",
    Generator,
    colorsOptions: {
        prefix: `:root {\n${INDENTATION}`,
        separator: `\n${INDENTATION}`,
        suffix: "\n}"
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
