const rules = Object.freeze({
    FONT_FACE: "font-face"
});

class AtRule {
    constructor(identifier, declarations) {
        this.identifier = identifier;
        this.declarationMap = {};

        declarations.forEach(declaration => {
            this.declarationMap[declaration.name] = declaration;
        });
    }

    static get Rule() {
        return rules;
    }

    get declarations() {
        return Object.values(this.declarationMap);
    }

    hasProperty(property) {
        return property in this.declarationMap;
    }

    addDeclaration(declaration) {
        this.declarationMap[declaration.name] = declaration;
    }

    removeDeclaration(declaration) {
        delete this.declarationMap[declaration.name];
    }
}

export default AtRule;
