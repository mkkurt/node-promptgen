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

## Installation

1. Make sure you have Node.js and npm (Node Package Manager) installed.
2. Install `node-promptgen` globally:
   ```bash
   npm install -g node-promptgen
   ```

## Usage

1. Run the script.

2. Follow the prompts to enter your project directory and choose whether to include the boilerplate analysis prompt.

3. The tool will generate a project_prompt.txt file in your project directory.

4. Use this prompt with your preferred AI language model to get a detailed analysis and ask questions about your project.
