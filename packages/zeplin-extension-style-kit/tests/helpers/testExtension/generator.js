import { isDeclarationInherited } from "@root/utils";
import { generateColorNameResolver, generateIdentifier } from "../../../utils";

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
        return `var(${PREFIX}${generateIdentifier(color.getFormattedName("kebab"))})`;
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
                        formatVariableName: this.formatColorVariable
                    })
                );
                return `${INDENTATION}${p.name}${SEPARATOR}${value}${SUFFIX}`;
            }).join("\n")
        }\n}`;
    }
}

export default TestGenerator;
