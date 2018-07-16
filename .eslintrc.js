module.exports = {
    extends: "@zeplin/eslint-config",
    "globals": {
        "Intl": true,
        "CSS": true
    },
    rules: {
        "no-var": "off",
        "no-magic-numbers": [
            "error",
            {
                "ignore": [-1, 0, 1, 2, 255]
            }
        ],
        "new-cap": "off",
        "valid-jsdoc": "off",
        "prefer-template": "error",
        "class-methods-use-this": "off"
    }
}