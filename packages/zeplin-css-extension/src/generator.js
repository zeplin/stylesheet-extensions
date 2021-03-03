import { isDeclarationInherited, generateIdentifier } from "zeplin-extension-style-kit/utils";

const PREFIX = "--";
const SEPARATOR = ": ";
const SUFFIX = ";";
const INDENTATION = "  ";

class CSS {
    constructor(container, params) {
        this.params = params;
        this.container = container;
    }

    formatColorVariable(color) {
        return `var(${PREFIX}${generateIdentifier(color.getFormattedName("kebab"))})`;
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
        const value = d.getValue(this.params, this.container, this.formatColorVariable);
        return `${INDENTATION}${d.name}${SEPARATOR}${value}${SUFFIX}`;
    }

    declarationsBlock(declarations) {
        return `{\n${declarations.map(this.declaration, this).join("\n")}\n}`;
    }

    variable(name, value) {
        return `${PREFIX}${generateIdentifier(name)}${SEPARATOR}${value.toStyleValue(this.params)}${SUFFIX}`;
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
