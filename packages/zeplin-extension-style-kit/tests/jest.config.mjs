import { ESM_TS_TRANSFORM_PATTERN } from 'ts-jest'

import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


export default {
    displayName: "unit",
    rootDir: path.resolve(__dirname, ".."),
    testMatch: [
        "<rootDir>/**/*.test.{js,ts}",
        "!<rootDir>/src/**/*.d.ts"
    ],
    extensionsToTreatAsEsm: [".ts"],
    moduleDirectories: ["node_modules"],
    transform: {
        [ESM_TS_TRANSFORM_PATTERN]: ["ts-jest", {
            tsconfig: "<rootDir>/tsconfig.json",
            useESM: true,
            babelConfig: true
        }]
    },
    moduleNameMapper: {
        '^@root/(.*)$': '<rootDir>/src/$1',
        '@testHelpers/(.*)$': '<rootDir>/tests/helpers/$1',
    },
    collectCoverageFrom: [
        "src/**/*.{js,ts}",
        "!**/node_modules/**",
        "!**/vendor/**",
        "!**/tests/**",
        "!**/coverage/**"
    ]
};
