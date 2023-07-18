import { promises as fs } from "node:fs"
import path from "node:path"
import ts from "typescript"

const configFileName = "./tsconfig.json"
const newRoot = "./build"

const traverse = async (dir: string, action: (dir: string, file: string) => Promise<void>) => {
  const entries = await fs.readdir(dir, { withFileTypes: true })
  for (const entry of entries) {
    if (entry.isDirectory()) {
      await traverse(path.join(dir, entry.name), action)
    } else {
      await action(dir, entry.name)
    }
  }
}

const printDiagnostics = function(...diagnostics: ts.Diagnostic[]) {
  for (const diagnostic of diagnostics) {
    if (diagnostic.file) {
      const { line, character } = ts.getLineAndCharacterOfPosition(diagnostic.file, diagnostic.start!);
      const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n");
      console.error(`${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`);
    } else {
      console.error(ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n"));
    }
  }
}

const configFile = ts.readConfigFile(configFileName, ts.sys.readFile)
if (configFile.error) {
  printDiagnostics(configFile.error)
  process.exit(1)
}

const configResult = ts.parseJsonConfigFileContent(configFile.config, ts.sys, "./")
if (configResult.errors.length > 0) {
  printDiagnostics(...configResult.errors)
  process.exit(1)
}

for (const type of ["mjs", "cjs"]) {
  try {
    await fs.access(type)
    await fs.rm(type, { recursive: true })
  } catch (err) {
  }

  const fileNames = new Array<string>()
  await traverse("src", async (dir, file) => {
    if (file.endsWith(".ts")) {
      let content = await fs.readFile(path.join(dir, file), { encoding: "utf-8" })

      const newFileName = path.join(newRoot, dir, file.replace(/\.ts$/, `.${type.replace(/js$/, "ts")}`))
      await fs.mkdir(path.dirname(newFileName), { recursive: true })
      content = content.replace(/(["'])([^"]+)\.ts\1/g, `$1$2.${type}$1`)
      await fs.writeFile(newFileName, content, { encoding: "utf-8" })

      fileNames.push(newFileName)
    }
  })

  const options: ts.CompilerOptions = {
    ...configResult.options,
    noEmit: false,
    emitDeclarationOnly: false,
    allowImportingTsExtensions: false,
    declaration: true,
    declarationMap: true,
    declarationDir: undefined,
    module: type === "mjs" ? ts.ModuleKind.ES2022 : ts.ModuleKind.CommonJS,
    moduleResolution: type === "cjs" ? ts.ModuleResolutionKind.Node16 : ts.ModuleResolutionKind.Node10,
    outDir: path.join(newRoot, type)
  }
  const host = ts.createCompilerHost(options)
  const program = ts.createProgram(fileNames, options, host)
  const emitResult = program.emit()
  if (emitResult.diagnostics.length > 0) {
    printDiagnostics(...emitResult.diagnostics)
    if (emitResult.emitSkipped) {
      process.exit(1)
    }
  }

  await fs.rename(path.join(newRoot, type), type)
  await fs.rm(path.join(newRoot, "src"), { recursive: true })
}

await fs.rmdir(newRoot)
