import path from "node:path";
import { fileURLToPath } from "node:url";
import { ESM_TS_JS_TRANSFORM_PATTERN, ESM_TS_TRANSFORM_PATTERN } from "ts-jest";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
    rootDir: path.resolve(__dirname, "."),
    extensionsToTreatAsEsm: [".ts"],

    moduleDirectories: ["node_modules"],
    transform: {
        [ESM_TS_JS_TRANSFORM_PATTERN]: ["ts-jest", {
            tsconfig: "<rootDir>/tsconfig.json",
            useESM: true,
            // babelConfig: true
        }]
    },
    moduleNameMapper: {
        "^@root/(.*)$": "<rootDir>/src/$1",
        // "base-extension": "<rootDir>/../base-extension/dist/index.js",
        "(.+)\\.js": "$1",
    }
};