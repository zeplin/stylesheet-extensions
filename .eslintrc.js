module.exports = {
    env: {
        "jest": true
    },
    extends: "@zeplin/eslint-config",
    "globals": {
        "Intl": true,
        "CSS": true
    },
    rules: {
        "no-var": "off",
        "new-cap": "off",
        "valid-jsdoc": "off",
        "prefer-template": "error",
        "class-methods-use-this": "off",
        "no-magic-numbers": ["warn", { "ignore": [-1, 0, 1, 2, 90, 180, 270, 360] }]
    }
}
