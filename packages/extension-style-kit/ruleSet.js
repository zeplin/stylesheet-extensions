class RuleSet {
    constructor(selector, props) {
        this.selector = selector;
        this.props = props;
    }

    addProp(prop) {
        this.props.push(prop);
    }

    removeProp(prop) {
        this.props = this.props.filter(p => !p.equals(prop));
    }
}

export default RuleSet;