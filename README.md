# node-promptgen

Generate prompts for AI analysis of your Node.js projects.

## Description

`node-promptgen` is a command-line tool that extracts code, project structure, and dependencies from your Node.js projects. It creates a comprehensive prompt that can be used with AI language models (like ChatGPT) to gain insights into your project's purpose, structure, potential improvements, and more.

Feel free to contribute to this project by adding more features or improving the existing ones.

## Features

- Extracts code snippets from `.js` files.
- Ignores the `node_modules` directory and other non-essential files.
- Includes project folder structure.
- Lists dependencies from `package.json`.
- Optionally adds a boilerplate prompt for AI analysis.

## Usage

1. Run the following command in your terminal:

```bash
git clone https://github.com/mkkurt/node-promptgen.git
cd node-promptgen
npm install
npm start
```

2. Follow the prompts to enter your project directory and choose whether to include the boilerplate analysis prompt.

3. The tool will generate a project_prompt.txt file in your project directory.

4. Use this prompt with your preferred AI language model to get a detailed analysis and ask questions about your project.
