import { fetch } from 'http-signed-fetch'

import { readFile } from 'node:fs/promises'

const actor = 'about.jsonld'
const actorData = JSON.parse(await readFile(actor, 'utf8'))

const domain = new URL(actorData.id).host
const username = actorData.preferredUsername
const publicKeyId = actorData.publicKey.id

const keypair = JSON.parse(await readFile('keypair.json', 'utf8'))

const url = `https://social.distributed.press/v1/@${username}@${domain}/inbox`

const post = 'newpost.jsonld'
const postContent = JSON.parse(await readFile(post, 'utf8'))

const response = await fetch(url, {
  keypair,
  publicKeyId,
  method: 'post',
  headers: {
    'Content-Type': 'application/ld+json',
    date: new Date().toUTCString(),
    host: new URL(url).host
  },
  body: JSON.stringify(
    makeActivity(
      makeURL(post + 'activity'),
      postContent
    )
  )
})

if (!response.ok) {
  throw new Error(await response.text())
}

console.log('Response OK')
console.log(await response.json())

function makeURL (path) {
  return `https://${domain}/${path}`
}

function makeActivity (id, object) {
  return {
    '@context': 'https://www.w3.org/ns/activitystreams',
    type: 'Create',
    id,
    actor: actorData.id,
    published: new Date().toUTCString(),
    to: [
      'https://www.w3.org/ns/activitystreams#Public'
    ],
    cc: [
      actorData.followers
    ],
    object
  }
}
