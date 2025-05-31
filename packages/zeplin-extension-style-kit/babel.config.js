/* eslint-env node */

export default {
    presets: [
        ["@babel/preset-env", {
            modules: false,
        }],
        "@babel/preset-typescript"
    ],
    plugins: [
        ["module-resolver", {
            root: ["./src"],
            alias: {
                tests: "./tests"
            }
        }]
    ]
};
