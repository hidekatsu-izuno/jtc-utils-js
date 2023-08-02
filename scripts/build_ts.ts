import { promises as fs } from "node:fs"
import path from "node:path"
import ts from "typescript"

const baseConfigFileName = "./tsconfig.json"
const mappings = [
  { type: "module", outDir: "mjs", tsExt: "mts" },
  { type: "commonjs", outDir: "cjs", tsExt: "cts" },
]

const configFile = ts.readConfigFile(baseConfigFileName, ts.sys.readFile)
if (configFile.error) {
  printDiagnostics(configFile.error)
  process.exit(1)
}

const configResult = ts.parseJsonConfigFileContent(configFile.config, ts.sys, "./")
if (configResult.errors.length > 0) {
  printDiagnostics(...configResult.errors)
  process.exit(1)
}

for (const mapping of mappings) {
  try {
    await fs.rm(mapping.outDir, { recursive: true })
  } catch (err) {
    // no handle
  }

  const newFileNames = new Array<string>()
  for (const fileName of configResult.fileNames) {
    let content = await fs.readFile(fileName, { encoding: "utf-8" })
    content = content.replace(/(["'])([^"]+)\.ts\1/g, `$1$2.${mapping.tsExt.replace("ts", "js")}$1`)

    const newFileName = path.join(mapping.outDir, fileName.replace(/\.ts$/, `.${mapping.tsExt}`))
    await fs.mkdir(path.dirname(newFileName), { recursive: true })
    await fs.writeFile(newFileName, content, { encoding: "utf-8" })

    newFileNames.push(newFileName)
  }

  const options: ts.CompilerOptions = {
    ...configResult.options,
    noEmit: false,
    emitDeclarationOnly: false,
    allowImportingTsExtensions: false,
    declaration: true,
    declarationMap: true,
    declarationDir: undefined,
    module: mapping.type === "module" ? ts.ModuleKind.ES2022 : ts.ModuleKind.CommonJS,
    moduleResolution: mapping.type === "module" ? ts.ModuleResolutionKind.Node16 : ts.ModuleResolutionKind.Node10,
    outDir: path.join(mapping.outDir, "lib")
  }
  const host = ts.createCompilerHost(options)
  const program = ts.createProgram(newFileNames, options, host)
  const emitResult = program.emit()
  if (emitResult.diagnostics.length > 0) {
    printDiagnostics(...emitResult.diagnostics)
    if (emitResult.emitSkipped) {
      process.exit(1)
    }
  }
}

function printDiagnostics(...diagnostics: ts.Diagnostic[]) {
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
