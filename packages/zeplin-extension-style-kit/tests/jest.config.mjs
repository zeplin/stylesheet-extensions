/* eslint-env node */

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
    testURL: "http://localhost",
    displayName: "unit",
    rootDir: path.resolve(__dirname, ".."),
    testMatch: [
        "<rootDir>/**/*.test.{js,ts}",
        "!<rootDir>/src/**/*.d.ts"
    ],
    extensionsToTreatAsEsm: [".ts"],
    transform: {
        "^.+\\.(t|j)sx?$": ["@babel/preset-env", {
            useESModules: true
        }]
    },
    moduleDirectories: ["node_modules"],
    moduleFileExtensions: ["js", "ts", "json"],
    transform: {
        "^.+\\.tsx?$": ["ts-jest", {
            tsconfig: "<rootDir>/tsconfig.json",
            babelConfig: true
        }]
    },
    collectCoverageFrom: [
        "src/**/*.{js,ts}",
        "!**/node_modules/**",
        "!**/vendor/**",
        "!**/tests/**",
        "!**/coverage/**"
    ]
};
