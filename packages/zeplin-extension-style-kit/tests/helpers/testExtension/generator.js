import { generateColorNameResolver, generateIdentifier, isDeclarationInherited } from "@root/utils";

const PREFIX = "--";
const SEPARATOR = ": ";
const SUFFIX = ";";
const INDENTATION = "  ";

class TestGenerator {
    constructor(container, params) {
        this.params = params;
        this.container = container;
    }

    formatColorVariable(color) {
        const colorName = (
            color.getFormattedName
                ? color.getFormattedName("kebab")
                : color.name
        );
        return `var(${PREFIX}${generateIdentifier(colorName)})`;
    }

    filterDeclarations(childDeclarations, parentDeclarations) {
        const { params: { showDefaultValues, showDimensions } } = this;

        return childDeclarations.filter(declaration => {
            if (!showDimensions && (declaration.name === "width" || declaration.name === "height")) {
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

    variable(name, value) {
        return `${PREFIX}${name}${SEPARATOR}${value.toStyleValue(this.params)}${SUFFIX}`;
    }

    ruleSet({ selector, declarations }, { parentDeclarations = [] } = {}) {
        const filteredDeclarations = this.filterDeclarations(declarations, parentDeclarations);
        return `${selector} {\n${
            filteredDeclarations.map(p => {
                const value = p.getValue(
                    this.params,
                    generateColorNameResolver({
                        container: this.container,
                        useLinkedStyleguides: this.params.useLinkedStyleguides,
                        formatVariableName: color => this.formatColorVariable(color)
                    })
                );
                return `${INDENTATION}${p.name}${SEPARATOR}${value}${SUFFIX}`;
            }).join("\n")
        }\n}`;
    }
}

export default TestGenerator;
