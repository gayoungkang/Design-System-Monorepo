import fs from "fs"
import path from "path"
import ts from "typescript"

type ReleaseTag = "@public" | "@internal"

const ROOT = process.cwd()
const UI_SRC_ROOT = path.join(ROOT, "packages/ui/src")
const PUBLIC_ENTRY = path.join(UI_SRC_ROOT, "public.ts")
const INTERNAL_ENTRY = path.join(UI_SRC_ROOT, "internal.ts")

const exists = (filePath: string) => fs.existsSync(filePath)
const readFile = (filePath: string) => fs.readFileSync(filePath, "utf8")
const writeFile = (filePath: string, content: string) => fs.writeFileSync(filePath, content, "utf8")

const resolveModuleFile = (fromFilePath: string, specifier: string) => {
  if (!specifier.startsWith("./")) return null

  const baseResolved = path.resolve(path.dirname(fromFilePath), specifier)
  const candidates = [
    `${baseResolved}.ts`,
    `${baseResolved}.tsx`,
    path.join(baseResolved, "index.ts"),
    path.join(baseResolved, "index.tsx"),
  ]

  return candidates.find(exists) ?? null
}

const hasReleaseTag = (text: string) => /@public\b|@internal\b|@beta\b|@alpha\b/.test(text)

const addTagBefore = (source: string, pos: number, tag: ReleaseTag) => {
  return source.slice(0, pos) + `/** ${tag} */\n` + source.slice(pos)
}

const processFile = (filePath: string, tag: ReleaseTag) => {
  let source = readFile(filePath)
  const sourceFile = ts.createSourceFile(filePath, source, ts.ScriptTarget.Latest, true)

  const insertions: number[] = []

  sourceFile.forEachChild((node) => {
    const isExport =
      (ts.canHaveModifiers(node) &&
        ts.getModifiers(node)?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword)) ||
      ts.isExportAssignment(node)

    if (!isExport) return

    const text = source.slice(node.getFullStart(), node.getStart())
    if (hasReleaseTag(text)) return

    insertions.push(node.getFullStart())
  })

  insertions
    .sort((a, b) => b - a)
    .forEach((pos) => {
      source = addTagBefore(source, pos, tag)
    })

  if (insertions.length > 0) {
    writeFile(filePath, source)
    console.log("UPDATED", filePath, `(+${insertions.length})`)
  }
}

const collectTargets = (entry: string, tag: ReleaseTag, visited = new Set<string>()) => {
  if (!exists(entry) || visited.has(entry)) return []

  visited.add(entry)

  const sourceFile = ts.createSourceFile(entry, readFile(entry), ts.ScriptTarget.Latest, true)

  const targets: string[] = []

  sourceFile.forEachChild((node) => {
    if (!ts.isExportDeclaration(node)) return
    if (!node.moduleSpecifier || !ts.isStringLiteral(node.moduleSpecifier)) return

    const resolved = resolveModuleFile(entry, node.moduleSpecifier.text)
    if (!resolved) return

    targets.push(resolved)
    collectTargets(resolved, tag, visited).forEach((f) => targets.push(f))
  })

  return targets
}

const main = () => {
  const publicTargets = collectTargets(PUBLIC_ENTRY, "@public")
  const internalTargets = collectTargets(INTERNAL_ENTRY, "@internal")

  const all = new Map<string, ReleaseTag>()

  publicTargets.forEach((f) => all.set(path.resolve(f), "@public"))
  internalTargets.forEach((f) => all.set(path.resolve(f), "@internal"))

  all.forEach((tag, filePath) => processFile(filePath, tag))
}

main()
