import Mixin from "zeplin-extension-style-kit/declarations/mixin";
import { isHtmlTag, isDeclarationInherited, generateIdentifier } from "zeplin-extension-style-kit/utils";

const PREFIX = "$";
const SEPARATOR = " = ";
const INDENTATION = "  ";

class Stylus {
    constructor(variables, params) {
        this.variables = variables;
        this.params = params;

        Object.keys(variables).forEach(vName => {
            this.variables[vName] = `${PREFIX}${variables[vName]}`;
        });
    }

    filterDeclarations(childDeclarations, parentDeclarations, isMixin) {
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
                return !isMixin && showDefaultValues;
            }

            return true;
        });
    }

    declaration(p, mixin) {
        if (p instanceof Mixin) {
            return `${INDENTATION}${p.identifier}()`;
        }

        let { params } = this;

        if (mixin) {
            params = Object.assign({}, params, { showDefaultValues: false });
        }

        return `${INDENTATION}${p.name} ${p.getValue(params, this.variables)}`;
    }

    variable(name, value) {
        return `${PREFIX}${generateIdentifier(name)}${SEPARATOR}${value.toStyleValue(this.params)}`;
    }

    ruleSet({ selector, declarations }, { parentDeclarations = [], scope = "", mixin = false } = {}) {
        const isMixin = !isHtmlTag(selector) && mixin;
        const filteredDeclarations = this.filterDeclarations(declarations, parentDeclarations, isMixin);
        const ruleSelector = isMixin ? selector.replace(/^\./, "") : selector;

        if (!filteredDeclarations.length) {
            return "";
        }

        let ruleSelector;

        if (isMixin) {
            ruleSelector = `${selector.replace(/^\./, "")}()`;
        } else {
            ruleSelector = `${scope ? `${scope} ` : ""}${selector}`;
        }

        return `${ruleSelector}\n${filteredDeclarations.map(p => this.declaration(p, isMixin)).join("\n")}\n`;
    }

    atRule({ identifier, declarations }) {
        return `@${identifier}\n${declarations.map(p => this.declaration(p)).join("\n")}\n`;
    }
}

export default Stylus;
