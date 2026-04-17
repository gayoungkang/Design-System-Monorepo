import fs from "fs"
import path from "path"
import ts from "typescript"

type ReleaseTag = "@public" | "@internal"

const ROOT = process.cwd()
const UI_SRC_ROOT = path.join(ROOT, "packages/ui/src")
const PUBLIC_ENTRY = path.join(UI_SRC_ROOT, "public.ts")
const INTERNAL_ENTRY = path.join(UI_SRC_ROOT, "internal.ts")

const TARGET_EXPORT_KINDS = new Set<ts.SyntaxKind>([
  ts.SyntaxKind.FunctionDeclaration,
  ts.SyntaxKind.ClassDeclaration,
  ts.SyntaxKind.InterfaceDeclaration,
  ts.SyntaxKind.TypeAliasDeclaration,
  ts.SyntaxKind.EnumDeclaration,
  ts.SyntaxKind.VariableStatement,
])

const ensurePosix = (input: string) => input.replace(/\\/g, "/")

const exists = (filePath: string) => fs.existsSync(filePath)

const readFile = (filePath: string) => fs.readFileSync(filePath, "utf8")

const writeFile = (filePath: string, content: string) => {
  fs.writeFileSync(filePath, content, "utf8")
}

const resolveExportTargetsFromEntry = (
  entryFilePath: string,
  releaseTag: ReleaseTag,
): Array<{ filePath: string; releaseTag: ReleaseTag }> => {
  if (!exists(entryFilePath)) return []

  const sourceText = readFile(entryFilePath)
  const sourceFile = ts.createSourceFile(entryFilePath, sourceText, ts.ScriptTarget.Latest, true)

  const targets: Array<{ filePath: string; releaseTag: ReleaseTag }> = []

  sourceFile.forEachChild((node) => {
    if (!ts.isExportDeclaration(node)) return
    if (!node.moduleSpecifier || !ts.isStringLiteral(node.moduleSpecifier)) return

    const specifier = node.moduleSpecifier.text
    if (!specifier.startsWith("./")) return

    const baseResolved = path.resolve(path.dirname(entryFilePath), specifier)
    const candidates = [
      `${baseResolved}.ts`,
      `${baseResolved}.tsx`,
      path.join(baseResolved, "index.ts"),
      path.join(baseResolved, "index.tsx"),
    ]

    const found = candidates.find(exists)

    if (!found) return

    targets.push({
      filePath: found,
      releaseTag,
    })
  })

  return targets
}

const getJsDocText = (node: ts.Node, sourceFile: ts.SourceFile) => {
  const ranges = ts.getLeadingCommentRanges(sourceFile.getFullText(), node.getFullStart()) ?? []

  for (const range of ranges.reverse()) {
    const text = sourceFile.getFullText().slice(range.pos, range.end)
    if (text.startsWith("/**")) return text
  }

  return ""
}

const hasReleaseTag = (node: ts.Node, sourceFile: ts.SourceFile) => {
  const jsDocText = getJsDocText(node, sourceFile)
  return /@public\b|@internal\b|@beta\b|@alpha\b/.test(jsDocText)
}

const isExportedTopLevelDeclaration = (node: ts.Node) => {
  if (!TARGET_EXPORT_KINDS.has(node.kind)) return false

  const modifiers = ts.canHaveModifiers(node) ? ts.getModifiers(node) : undefined
  if (!modifiers) return false

  return modifiers.some((modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword)
}

const buildInsertionText = (tag: ReleaseTag, lineEnding: string) => `/** ${tag} */${lineEnding}`

const detectLineEnding = (text: string) => (text.includes("\r\n") ? "\r\n" : "\n")

const applyReleaseTagToFile = (filePath: string, releaseTag: ReleaseTag) => {
  const sourceText = readFile(filePath)
  const sourceFile = ts.createSourceFile(filePath, sourceText, ts.ScriptTarget.Latest, true)
  const lineEnding = detectLineEnding(sourceText)

  const insertions: Array<{ pos: number; text: string }> = []

  sourceFile.forEachChild((node) => {
    if (!isExportedTopLevelDeclaration(node)) return
    if (hasReleaseTag(node, sourceFile)) return

    insertions.push({
      pos: node.getFullStart(),
      text: buildInsertionText(releaseTag, lineEnding),
    })
  })

  if (insertions.length === 0) {
    return {
      filePath,
      updated: false,
      insertedCount: 0,
    }
  }

  let nextText = sourceText

  insertions
    .sort((a, b) => b.pos - a.pos)
    .forEach(({ pos, text }) => {
      nextText = `${nextText.slice(0, pos)}${text}${nextText.slice(pos)}`
    })

  writeFile(filePath, nextText)

  return {
    filePath,
    updated: true,
    insertedCount: insertions.length,
  }
}

const main = () => {
  const targets = [
    ...resolveExportTargetsFromEntry(PUBLIC_ENTRY, "@public"),
    ...resolveExportTargetsFromEntry(INTERNAL_ENTRY, "@internal"),
  ]

  const deduped = new Map<string, ReleaseTag>()

  for (const target of targets) {
    const normalized = ensurePosix(path.relative(ROOT, target.filePath))
    deduped.set(normalized, target.releaseTag)
  }

  if (deduped.size === 0) {
    console.log("No export targets found from public.ts/internal.ts")
    process.exit(0)
  }

  const results = Array.from(deduped.entries()).map(([relativePath, releaseTag]) =>
    applyReleaseTagToFile(path.join(ROOT, relativePath), releaseTag),
  )

  const updated = results.filter((result) => result.updated)
  const totalInserted = results.reduce((sum, result) => sum + result.insertedCount, 0)

  console.log("")
  console.log("Release tag apply result")
  console.log("------------------------")

  results.forEach((result) => {
    const status = result.updated ? "UPDATED" : "SKIPPED"
    console.log(
      `${status}  ${ensurePosix(path.relative(ROOT, result.filePath))}  (+${result.insertedCount})`,
    )
  })

  console.log("------------------------")
  console.log(`Files processed: ${results.length}`)
  console.log(`Files updated:   ${updated.length}`)
  console.log(`Tags inserted:   ${totalInserted}`)
  console.log("")
}

main()
