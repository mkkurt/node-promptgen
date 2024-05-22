import fs from "fs";
import path from "path";
import readline from "readline";

// --- Configuration ---

const DEFAULT_OUTPUT_FILENAME = "project_prompt.txt";
const SUPPORTED_FILE_TYPES = [".js"];

// --- Utility Functions ---

function traverseDirectory(
  dirPath,
  prefix = "",
  result = { structure: "", codeSnippets: [], dependencies: {} }
) {
  const files = fs.readdirSync(dirPath);

  for (const file of files) {
    const filePath = path.join(dirPath, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory() && file !== "node_modules" && file !== ".git") {
      result.structure += `${prefix}- ${file}/\n`;
      traverseDirectory(filePath, prefix + "  ", result);
    } else if (
      stat.isFile() &&
      SUPPORTED_FILE_TYPES.includes(path.extname(file))
    ) {
      result.structure += `${prefix}- ${file}\n`;
      const code = fs.readFileSync(filePath, "utf-8");
      result.codeSnippets.push(`// ----- ${filePath} -----\n${code}`); // Add filename before code
    } else if (file === "package.json") {
      const packageJson = JSON.parse(fs.readFileSync(filePath, "utf-8"));
      result.dependencies = {
        ...packageJson.dependencies,
        ...packageJson.devDependencies,
      };
    }
  }

  return result;
}

function buildPrompt(
  includeAnalysisPrompt,
  structure,
  dependencies,
  codeSnippets
) {
  let template = `
**Project Structure:**
\`\`\`
${structure}
\`\`\`

**Dependencies:**
\`\`\`
${JSON.stringify(dependencies, null, 2)}
\`\`\`

**Code Snippets:**
\`\`\`javascript
${codeSnippets.join("\n\n")}
\`\`\`
`;

  if (includeAnalysisPrompt) {
    template = `You are an AI assistant knowledgeable in Node.js development. You are tasked with understanding and assisting with the following project:\n\n${template}\n\nPlease provide a detailed analysis of the project's:\n\n* **Purpose:** What does the project aim to achieve?\n* **Structure:** How is the code organized (e.g., modules, files, main components)? How does the project structure reflect the project's purpose?\n* **Dependencies:** What external libraries or frameworks does it rely on? How do these dependencies contribute to the project's functionality and purpose?\n* **Potential Improvements:** Are there areas where code refactoring, optimization, or the addition of features could be beneficial? Consider both code quality and alignment with the project structure.\n* **Key Functionality:** Describe the core functions or features of the project. How do different parts of the project contribute to these functionalities?\n* **Security Considerations:** Are there any potential security vulnerabilities that need to be addressed? Consider the project's dependencies and their known vulnerabilities.\n* **Further Questions:** Feel free to ask for clarification on specific aspects of the code or project.\n\nPlease be as thorough as possible in your analysis.`;
  }

  return template;
}

// --- Main Execution ---

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function askIncludePrompt(projectRoot, structure, dependencies, codeSnippets) {
  // Add projectRoot as a parameter
  rl.question("Include boilerplate analysis prompt? (yes/no): ", (answer) => {
    const includePrompt = answer.toLowerCase() === "yes";
    const promptTemplate = buildPrompt(
      includePrompt,
      structure,
      dependencies,
      codeSnippets
    );

    const promptFilePath = path.join(projectRoot, DEFAULT_OUTPUT_FILENAME); // Use projectRoot here
    fs.writeFileSync(promptFilePath, promptTemplate);
    console.log("Project prompt created successfully:", promptFilePath);

    rl.close();
  });
}

rl.question("Enter the path to your project directory: ", (projectRoot) => {
  if (!fs.existsSync(projectRoot) || !fs.statSync(projectRoot).isDirectory()) {
    console.error("Error: Invalid directory path.");
    rl.close(); // Close readline on error
    process.exit(1);
  }

  const result = traverseDirectory(projectRoot);

  askIncludePrompt(
    projectRoot,
    result.structure,
    result.dependencies,
    result.codeSnippets
  ); // Pass projectRoot to askIncludePrompt
});
