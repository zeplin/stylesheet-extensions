import Mixin from "zeplin-extension-style-kit/props/mixin";
import { isPropInherited, isHtmlTag } from "zeplin-extension-style-kit/utils";

const PREFIX = "@";
const MIDFIX = ":";
const SUFFIX = ";";
const INDENTATION = "  ";

class Less {
    constructor(variables, params) {
        this.variables = variables;
        this.params = params;

        Object.keys(variables).forEach(vName => {
            this.variables[vName] = `${PREFIX}${variables[vName]}`;
        });
    }

    filterProps(childProps, parentProps, isMixin) {
        const { params: { showDefaultValues, showDimensions } } = this;

        return childProps.filter(prop => {
            if (!showDimensions && (prop.name === "width" || prop.name === "height")) {
                return false;
            }

            const parentProp = parentProps.find(p => p.name === prop.name);

            if (parentProp) {
                if (!parentProp.equals(prop)) {
                    return true;
                }

                return !isPropInherited(prop.name);
            }

            if (prop.hasDefaultValue && prop.hasDefaultValue()) {
                return !isMixin && showDefaultValues;
            }

            return true;
        });
    }

    prop(p, mixin) {
        if (p instanceof Mixin) {
            return `${INDENTATION}.${p.identifier.toLowerCase()}()${SUFFIX}`;
        }

        let { params } = this;

        if (mixin) {
            params = Object.assign({}, params, { showDefaultValues: false });
        }

        return `${INDENTATION}${p.name}${MIDFIX} ${p.getValue(params, this.variables)}${SUFFIX}`;
    }

    variable(name, value) {
        return `${PREFIX}${name}${MIDFIX} ${value.toStyleValue(this.params)}${SUFFIX}`;
    }

    ruleSet({ selector, props }, { parentProps = [], mixin = false } = {}) {
        const isMixin = !isHtmlTag(selector) && mixin;
        const filteredProps = this.filterProps(props, parentProps, isMixin);
        const ruleSelector = isMixin ? selector.toLowerCase() : selector;

        return `${ruleSelector}${isMixin ? "()" : ""} {\n${filteredProps.map(p => this.prop(p, isMixin)).join("\n")}\n}`;
    }
}

export default Less;