## RuleSet

Rule sets represent a property block and the selector identifying it.

### `constructor(selector, declarations)`: `RuleSet`
Creates an instance identifed by `selector` and contains `declarations` as style properties.

#### Parameters:
- `selector`: `string`
- `declarations`: Array of [`StyleDeclaration`](./declarations.md#styledeclaration).

### `selector`: `string`
Returns identifying selector.

### `addDeclaration(declaration)`: `void`
Adds a declaration to the array.

#### Parameters:
 - `declaration`: [`StyleDeclaration`](./declarations.md#styledeclaration)

### `removeDeclaration(declaration)`: `void`
Removes a declaration from the array.

#### Parameters:
 - `declaration`: [`StyleDeclaration`](./declarations.md#styledeclaration)
