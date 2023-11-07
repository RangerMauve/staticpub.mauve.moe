import { fetch } from 'http-signed-fetch'

import { readFile } from 'node:fs/promises'

const actor = 'about.jsonld'
const actorData = JSON.parse(await readFile(actor, 'utf8'))

const domain = new URL(actorData.id).host
const username = actorData.preferredUsername
const publicKeyId = actorData.publicKey.id

const keypair = JSON.parse(await readFile('keypair.json', 'utf8'))

const url = `https://social.dp.chanterelle.xyz/v1/@${username}@${domain}`

const response = await fetch(url, {
  keypair,
  publicKeyId,
  method: 'post',
  headers: {
    'Content-Type': 'application/ld+json',
    date: new Date().toUTCString(),
    host: new URL(url).host
  },
  body: JSON.stringify({
    actorUrl: actorData.id,
    publicKeyId,
    keypair
  })
})

if (!response.ok) {
  throw new Error(response.status + ': ' + await response.text())
}

console.log('Response OK')
console.log(await response.json())
