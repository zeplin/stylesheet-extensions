import { extensionFactory } from "zeplin-extension-style-kit/factory";

import Generator from "./generator";
import { COPYRIGHT } from "./constants";

const exportPrefix = `${COPYRIGHT}\n\n`;

export default extensionFactory({
    language: "scss",
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
