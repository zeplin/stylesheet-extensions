import { isDeclarationInherited, generateIdentifier } from "zeplin-extension-style-kit/utils";

const PREFIX = "--";
const MIDFIX = ":";
const SUFFIX = ";";
const INDENTATION = "  ";

class CSS {
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

    declaration(d) {
        return `${INDENTATION}${d.name}${MIDFIX} ${d.getValue(this.params, this.variables)}${SUFFIX}`;
    }

    declarationsBlock(declarations) {
        return `{\n${declarations.map(this.declaration, this).join("\n")}\n}`;
    }

    variable(name, value) {
        return `${PREFIX}${generateIdentifier(name)}${MIDFIX} ${value.toStyleValue(this.params)}${SUFFIX}`;
    }

    ruleSet({ selector, declarations }, { parentDeclarations = [] } = {}) {
        const filteredDeclarations = this.filterDeclarations(declarations, parentDeclarations);
        return `${selector} ${this.declarationsBlock(filteredDeclarations)}`;
    }

    atRule({ identifier, declarations }) {
        return `@${identifier} ${this.declarationsBlock(declarations)}`;
    }
}

export default CSS;
