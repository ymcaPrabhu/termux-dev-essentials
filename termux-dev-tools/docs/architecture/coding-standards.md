# Coding Standards

All code contributed to this project must adhere to the following standards to ensure it is consistent, readable, and maintainable.

### General

1.  **Language:** All code, comments, and documentation must be written in English.
2.  **File Headers:** All script files should include a header comment explaining their purpose and author.
3.  **TODOs:** Mark areas that need future work with `TODO:` followed by a description of the task and, if possible, an owner or issue number.

### Shell Scripts (Bash/Zsh)

1.  **Linting:** All shell scripts must pass `shellcheck` without errors or warnings. This is to be enforced in a pre-commit hook if possible.
2.  **Style:** Follow the [Google Shell Style Guide](https://google.github.io/styleguide/shellguide.html) for best practices.
3.  **Safety:** Start all scripts with `set -euo pipefail`. This ensures that scripts will exit on an error, on the use of an unset variable, and that errors in pipelines are not masked.
4.  **Variables:** Declare variables within functions as `local` to avoid polluting the global scope. Use `${VAR}` for consistency when referencing variables.
5.  **Portability:** While primarily for Termux, avoid highly obscure or non-standard shell features where possible to maintain readability and potential future compatibility.

### Node.js (JavaScript)

1.  **Linting:** All JavaScript code must pass `eslint` based on the project's `.eslintrc` configuration, which will be based on `eslint:recommended`.
2.  **Formatting:** All JavaScript code must be formatted using `prettier` according to the project's `.prettierrc` configuration. This should be run automatically on pre-commit.
3.  **Style:** Use modern ECMAScript (ES6+) features such as `const`, `let`, arrow functions, and promises. Avoid using `var`.
4.  **Documentation:** Use JSDoc comments for all public functions to describe their purpose, parameters, and return values.
5.  **Dependencies:** Use `npm` for package management. The `package-lock.json` file must be committed. Avoid committing the `node_modules` directory.

### Markdown

1.  **Linting:** All Markdown documents should adhere to the rules set by a linter like `markdownlint` to ensure consistency.
2.  **Line Wrapping:** For readability in terminals and editors, wrap text at 100 characters where possible.
