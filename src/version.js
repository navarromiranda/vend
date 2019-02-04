const { gitDescribeSync } = require('git-describe')
const { version } = require('../package.json')
const { resolve, relative } = require('path')
const { writeFileSync } = require('fs')

const gitInfo = gitDescribeSync({
  dirtyMark: false,
  dirtySemver: false
})

gitInfo.version = version

const file = resolve(__dirname, '..', 'src', 'environments', 'version.ts')
writeFileSync(file,
  `export const VERSION = ${JSON.stringify(gitInfo, null, 4)};`, { encoding: 'utf-8' })

console.log(`Wrote version info ${gitInfo.raw} to ${relative(resolve(__dirname, '..'), file)}`)
console.log(`Wrote ${JSON.stringify(gitInfo)} to ${relative(resolve(__dirname, '..'), file)}`)
