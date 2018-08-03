import { isDeclarationInherited } from "@root/utils";

const PREFIX = "--";
const MIDFIX = ":";
const SUFFIX = ";";
const INDENTATION = "  ";

class TestGenerator {
    constructor(variables, params) {
        this.variables = variables;
        this.params = params;

        Object.keys(variables).forEach(vName => {
            this.variables[vName] = `var(${PREFIX}${variables[vName]})`;
        });
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
        return `${PREFIX}${name}${MIDFIX} ${value.toStyleValue(this.params)}${SUFFIX}`;
    }

    ruleSet({ selector, declarations }, { parentDeclarations = [] } = {}) {
        const filteredDeclarations = this.filterDeclarations(declarations, parentDeclarations);
        return `${selector} {\n${filteredDeclarations.map(p => `${INDENTATION}${p.name}${MIDFIX} ${p.getValue(this.params, this.variables)}${SUFFIX}`).join("\n")}\n}`;
    }
}

export default TestGenerator;