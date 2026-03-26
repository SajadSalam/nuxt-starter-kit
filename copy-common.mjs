import fs from 'fs'
import path from 'path'

const src = 'common'
const dest = 'template/common'

fs.cpSync(src, dest, {
  recursive: true,
  filter: (s) => !s.replace(/\\/g, '/').includes('/node_modules'),
})

console.log('common/ copied to template/common/')
