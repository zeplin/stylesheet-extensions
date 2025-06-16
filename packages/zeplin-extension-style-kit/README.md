# zeplin-extension-style-kit

This package aims to provide an API to generate CSS-like style code snippets from the data exposed to Zeplin extensions. Even though target language or dialect can be different from CSS, preprocessors or CSS-in-JS solutions use the same property set and value format with CSS.

CSS properties and value formats are modeled in `zeplin-extension-style-kit` to form an intermediate representation. This representation is mostly language agnostic and can be used to develop an extension that generates similar style code snippets, e.g. Sass, React Native, styled-components.
