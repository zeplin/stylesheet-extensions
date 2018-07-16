import Mixin from "../../extension-style-kit/props/mixin";

const PREFIX = "$";
const MIDFIX = " =";
const SUFFIX = "";
const INDENTATION = "  ";

class Stylus {
    constructor(variables, params) {
        this.variables = variables;
        this.params = params;

        Object.keys(variables).forEach(vName => {
            this.variables[vName] = `${PREFIX}${variables[vName]}`;
        });
    }

    prop(p, mixin) {
        if (p instanceof Mixin) {
            return `${INDENTATION}${p.getValue()}`;
        }

        let params = this.params;

        if (mixin) {
            params = Object.assign({}, this.params, { defaultValues: false });
        }

        return `${INDENTATION}${p.name}${MIDFIX} ${p.getValue(params, this.variables)}${SUFFIX}`;
    }

    variable(name, value) {
        return `${PREFIX}${name}${MIDFIX} ${value.toStyleValue(this.params)}${SUFFIX}`;
    }

    ruleSet({ selector, props }, mixin = false) {
        return `${selector}${mixin ? "()" : ""} {\n${props.map(p => this.prop(p, mixin)).join("\n")}\n}`;
    }
}

export default Stylus;