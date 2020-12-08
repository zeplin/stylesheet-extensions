import { createExtension } from "base-extension";

import Generator from "./generator";
import { COPYRIGHT } from "./constants";

const exportPrefix = `${COPYRIGHT}\n\n`;

export default createExtension({
    language: "sass",
    Generator,
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
