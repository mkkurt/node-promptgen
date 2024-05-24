# node-promptgen

Generate prompts for AI analysis of your JS projects.

## Description

`node-promptgen` is a command-line tool that extracts code, project structure, and dependencies from your Node.js projects. It creates a comprehensive prompt that can be used with AI language models (like ChatGPT) to gain insights into your project's purpose, structure, potential improvements, and more.

Feel free to contribute to this project by adding more features or improving the existing ones.

## Features

- Extracts code snippets from supported file types, which can be customized in the `SUPPORTED_FILE_TYPES` array.
- Ignores the `node_modules` and `.git` directories. You can also add more, tool will ask for it.
- Extracts project folder structure and includes it in the prompt.
- Lists dependencies from `package.json`.
- Optionally adds a basic boilerplate explainer prompt.

## Usage

1. Run the following command in your terminal:

```bash
git clone https://github.com/mkkurt/node-promptgen.git
cd node-promptgen
npm install
npm start
```

2. Follow the prompts to enter your project directory, add custom ignore list and choose whether to include the boilerplate analysis prompt.

3. The tool will generate a project_prompt.txt file in your *target project directory*.

4. Use the generated prompt with your preferred AI language model to get a detailed analysis and ask questions about your project.
