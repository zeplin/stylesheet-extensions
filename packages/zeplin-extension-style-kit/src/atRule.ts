import { StyleDeclaration } from "./common.js";

const rules = Object.freeze({
    FONT_FACE: "font-face"
});

export class AtRule {
    identifier: string;
    private declarationMap: Record<string, StyleDeclaration>;

    constructor(identifier: string, declarations: StyleDeclaration[] = []) {
        this.identifier = identifier;
        this.declarationMap = {};

        declarations.forEach(declaration => {
            this.declarationMap[declaration.name] = declaration;
        });
    }

    static get Rule() {
        return rules;
    }

    get declarations(): StyleDeclaration[] {
        return Object.values(this.declarationMap);
    }

    hasProperty(property: string): boolean {
        return property in this.declarationMap;
    }

    addDeclaration(declaration: StyleDeclaration): void {
        this.declarationMap[declaration.name] = declaration;
    }

    removeDeclaration(declaration: StyleDeclaration): void {
        delete this.declarationMap[declaration.name];
    }
}
