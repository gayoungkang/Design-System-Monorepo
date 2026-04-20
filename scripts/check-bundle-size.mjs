import fs from "fs"
import path from "path"

const ROOT = process.cwd()
const TARGETS = [
  {
    name: "@acme/ui ESM bundle",
    filePath: path.join(ROOT, "packages/ui/dist/index.mjs"),
    maxSizeKB: 150,
  },
  {
    name: "apps/web bundle",
    dirPath: path.join(ROOT, "apps/web/dist/assets"),
    filePattern: /^index-.*\.js$/,
    maxSizeKB: 250,
  },
]

const toKB = (bytes) => Number((bytes / 1024).toFixed(2))

const fail = (message) => {
  console.error(`❌ ${message}`)
  process.exit(1)
}

const pass = (message) => {
  console.log(`✅ ${message}`)
}

const checkFile = ({ name, filePath, maxSizeKB }) => {
  if (!fs.existsSync(filePath)) {
    fail(`${name}: file not found -> ${path.relative(ROOT, filePath)}`)
  }

  const stats = fs.statSync(filePath)
  const sizeKB = toKB(stats.size)

  if (sizeKB > maxSizeKB) {
    fail(`${name}: ${sizeKB}KB exceeds limit ${maxSizeKB}KB`)
  }

  pass(`${name}: ${sizeKB}KB / limit ${maxSizeKB}KB`)
}

const checkDirPattern = ({ name, dirPath, filePattern, maxSizeKB }) => {
  if (!fs.existsSync(dirPath)) {
    fail(`${name}: directory not found -> ${path.relative(ROOT, dirPath)}`)
  }

  const matched = fs.readdirSync(dirPath).find((file) => filePattern.test(file))

  if (!matched) {
    fail(`${name}: no file matched pattern ${filePattern}`)
  }

  const targetFilePath = path.join(dirPath, matched)
  const stats = fs.statSync(targetFilePath)
  const sizeKB = toKB(stats.size)

  if (sizeKB > maxSizeKB) {
    fail(`${name}: ${matched} is ${sizeKB}KB and exceeds limit ${maxSizeKB}KB`)
  }

  pass(`${name}: ${matched} ${sizeKB}KB / limit ${maxSizeKB}KB`)
}

for (const target of TARGETS) {
  if ("filePath" in target) {
    checkFile(target)
    continue
  }

  checkDirPattern(target)
}

pass("Bundle size check passed")
