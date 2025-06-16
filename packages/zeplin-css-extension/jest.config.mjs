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
            useESM: true
        }]
    },
    transformIgnorePatterns: [
        "tests/"
    ],
    moduleNameMapper: {
        "^@root/(.*)$": "<rootDir>/dist/$1",
        "(.+)\\.js": "$1",
    }
};