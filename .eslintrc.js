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
        "class-methods-use-this": "off"
    }
}