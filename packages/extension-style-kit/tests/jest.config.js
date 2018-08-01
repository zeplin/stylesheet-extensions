/* eslint-env node */

const path = require("path");

module.exports = {
    testURL: "http://localhost",
    displayName: "unit",
    rootDir: path.resolve(__dirname, ".."),
    testMatch: [
        "<rootDir>/**/*.test.js"
    ],
    moduleDirectories: ["node_modules"],
    collectCoverageFrom: [
        "**/*.js",
        "!coverage/**/*",
        "!tests/helpers/**/*.js",
        "!tests/jest.config.js"
    ]
};
