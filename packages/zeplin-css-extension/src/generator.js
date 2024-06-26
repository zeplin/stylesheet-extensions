import {
    isDeclarationInherited,
    generateColorNameResolver,
    generateLinkedColorVariableNameResolver,
    generateVariableName
} from "zeplin-extension-style-kit/utils";

const PREFIX = "--";
const SEPARATOR = ": ";
const DEFAULT_VALUE_SEPARATOR = ", ";
const SUFFIX = ";";
const INDENTATION = "  ";

class CSS {
    constructor(container, params) {
        this.params = params;
        this.container = container;
    }

    formatColorVariable(color, options) {
        let defaultColorValue = "";
        if (options && options.defaultColorStringByFormat) {
            defaultColorValue = `${DEFAULT_VALUE_SEPARATOR}${options.defaultColorStringByFormat}`;
        }

        return `var(${PREFIX}${generateVariableName(
            color.originalName || color.name, this.params.variableNameFormat
        )}${defaultColorValue})`;
    }

    filterDeclarations(childDeclarations, parentDeclarations) {
        const { params: { showDefaultValues, showDimensions, showPaddingMargin } } = this;

        return childDeclarations.filter(declaration => {
            if (!showDimensions && (declaration.name === "width" || declaration.name === "height")) {
                return false;
            }

            if (!showPaddingMargin && (declaration.name === "margin" || declaration.name === "padding")) {
                return false;
            }

            const parentDeclaration = parentDeclarations.find(p => p.name === declaration.name);

            if (parentDeclaration) {
                if (!parentDeclaration.equals(declaration)) {
                    return true;
                }

                return !isDeclarationInherited(declaration.name);
            }

            if (declaration.hasDefaultValue && declaration.hasDefaultValue()) {
                return showDefaultValues;
            }

            return true;
        });
    }

    declaration(d) {
        const value = d.getValue(
            this.params,
            generateColorNameResolver({
                container: this.container,
                useLinkedStyleguides: this.params.useLinkedStyleguides,
                formatVariableName: (color, options) => this.formatColorVariable(color, options)
            })
        );
        return `${INDENTATION}${d.name}${SEPARATOR}${value}${SUFFIX}`;
    }

    declarationsBlock(declarations) {
        return `{\n${declarations.map(this.declaration, this).join("\n")}\n}`;
    }

    variable(name, value) {
        const generatedName = generateVariableName(name, this.params.variableNameFormat);

        let colorNameResolver;
        if (value.object && value.object.linkedVariableSourceId) {
            colorNameResolver = generateLinkedColorVariableNameResolver({
                container: this.container,
                useLinkedStyleguides: this.params.useLinkedStyleguides,
                colorFormat: this.params.colorFormat,
                formatVariableName: (color, options) => this.formatColorVariable(color, options)
            });
        }

        const variableValue = value.toStyleValue(this.params, colorNameResolver);

        return `${PREFIX}${generatedName}${SEPARATOR}${variableValue}${SUFFIX}`;
    }

    ruleSet({ selector, declarations }, { parentDeclarations = [], scope = "" } = {}) {
        const filteredDeclarations = this.filterDeclarations(declarations, parentDeclarations);
        const ruleSelector = scope ? `${scope} ${selector}` : selector;

        if (!filteredDeclarations.length) {
            return "";
        }

        return `${ruleSelector} ${this.declarationsBlock(filteredDeclarations)}`;
    }

    atRule({ identifier, declarations }) {
        return `@${identifier} ${this.declarationsBlock(declarations)}`;
    }
}

export default CSS;
