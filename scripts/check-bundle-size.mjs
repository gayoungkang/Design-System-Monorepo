import fs from "node:fs"
import path from "node:path"

const KB = 1024
const LIMIT_KB = Number(process.env.BUNDLE_LIMIT_KB ?? 300)

const target = path.resolve("apps/web/dist/assets")

if (!fs.existsSync(target)) {
  console.error(`Missing: ${target} (run build first)`)
  process.exit(1)
}

const files = fs
  .readdirSync(target)
  .filter((f) => f.endsWith(".js") || f.endsWith(".css"))
  .map((f) => {
    const p = path.join(target, f)
    const size = fs.statSync(p).size
    return { file: `assets/${f}`, size }
  })
  .sort((a, b) => b.size - a.size)

const total = files.reduce((acc, f) => acc + f.size, 0)
const totalKb = Math.round(total / KB)

console.log("Bundle files:")
for (const f of files.slice(0, 20)) {
  console.log(`- ${f.file}: ${Math.round(f.size / KB)} KB`)
}

console.log(`TOTAL: ${totalKb} KB (limit: ${LIMIT_KB} KB)`)

if (totalKb > LIMIT_KB) {
  console.error("❌ Bundle size exceeded")
  process.exit(1)
}

console.log("✅ Bundle size OK")
