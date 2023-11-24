import { fetch } from 'http-signed-fetch'

import { readFile } from 'node:fs/promises'

const actor = 'about.jsonld'
const actorData = JSON.parse(await readFile(actor, 'utf8'))
const publicKeyId = actorData.publicKey.id

const keypair = JSON.parse(await readFile('keypair.json', 'utf8'))

const url = 'https://social.distributed,press/v1/allowlist'
const method = 'post'

console.log(method, ':', url)

const response = await fetch(url, {
  keypair,
  publicKeyId,
  method,
  headers: {
    'Content-Type': 'text/plain'
  },
  // Allow anyone to follow us automatically
  body: '@*@*'
})

if (!response.ok) {
  throw new Error(await response.text())
}

console.log('Response OK')
console.log(await response.json())
