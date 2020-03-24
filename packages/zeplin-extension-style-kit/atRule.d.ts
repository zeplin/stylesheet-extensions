import { StyleDeclaration } from "./common";

declare class AtRule {
    constructor(identifier: string, declarations: Array<StyleDeclaration>);

    identifier: string;

    static Rule: object;

    declarations: Array<StyleDeclaration>;

    addDeclaration(declaration: StyleDeclaration): void;

    removeDeclaration(declaration: StyleDeclaration): void;
}

export = AtRule;
