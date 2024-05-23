import fs from "fs";
import path from "path";
import readline from "readline";

// --- Configuration ---

const DEFAULT_OUTPUT_FILENAME = "project_prompt.txt";
const SUPPORTED_FILE_TYPES = [".js", ".ts", ".jsx", ".tsx"];
const IGNORED_DIRECTORIES = ["node_modules", ".git"];

// --- Utility Functions ---

function traverseDirectory(
  dirPath,
  prefix = "",
  result = { structure: "", codeSnippets: [], dependencies: {} },
  ignoredFilesAndDirs = []
) {
  const files = fs.readdirSync(dirPath);

  for (const file of files) {
    const filePath = path.join(dirPath, file);
    const stat = fs.statSync(filePath);

    if (
      ignoredFilesAndDirs.includes(file) ||
      ignoredFilesAndDirs.includes(`/${file}/`)
    ) {
      continue;
    }

    if (stat.isDirectory() && !IGNORED_DIRECTORIES.includes(file)) {
      result.structure += `${prefix}- ${file}/\n`;
      traverseDirectory(filePath, prefix + "  ", result, ignoredFilesAndDirs);
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
  rl.question("Include boilerplate analysis prompt? (yes/no): ", (answer) => {
    const includePrompt = answer.toLowerCase() === "yes";
    const promptTemplate = buildPrompt(
      includePrompt,
      structure,
      dependencies,
      codeSnippets
    );

    const promptFilePath = path.join(projectRoot, DEFAULT_OUTPUT_FILENAME);
    fs.writeFileSync(promptFilePath, promptTemplate);
    console.log("Project prompt created successfully:", promptFilePath);

    rl.close();
  });
}

function convertToAbsolutePath(relativePath) {
  if (relativePath.startsWith("")) {
    return path.resolve(process.env.HOME, relativePath.slice(1));
  } else if (relativePath.startsWith(".")) {
    return path.resolve(process.cwd(), relativePath);
  } else {
    return path.resolve(process.cwd(), relativePath);
  }
}

function askCustomIgnoredFilesAndDirs(callback) {
  rl.question(
    "Enter custom files or folders to ignore (separated by commas): ",
    (answer) => {
      const ignoredFilesAndDirs = answer.split(",").map((item) => item.trim());
      callback(ignoredFilesAndDirs);
    }
  );
}

rl.question("Enter the path to your project directory: ", (projectRoot) => {
  console.log("Project root:", projectRoot);
  if (!fs.existsSync(projectRoot) || !fs.statSync(projectRoot).isDirectory()) {
    console.error("Error: Invalid directory path.");
    rl.close();
    process.exit(1);
  }

  askCustomIgnoredFilesAndDirs((ignoredFilesAndDirs) => {
    const result = traverseDirectory(
      projectRoot,
      "",
      { structure: "", codeSnippets: [], dependencies: {} },
      ignoredFilesAndDirs
    );

    askIncludePrompt(
      projectRoot,
      result.structure,
      result.dependencies,
      result.codeSnippets
    );
  });
});
