import { fetch } from 'http-signed-fetch'

import { readFile } from 'node:fs/promises'

const domain = 'staticpub.mauve.moe'
const username = 'mauve'
const publicKeyId = `https://${domain}/about.jsonld#main-key`

const url = `https://social.dp.chanterelle.xyz/v1/@${username}@${domain}/inbox`

const keypair = JSON.parse(await readFile('keypair.json', 'utf8'))

const post = 'newpost.jsonld'
const actor = 'about.jsonld'

const postContent = JSON.parse(await readFile(post, 'utf8'))
const actorData = JSON.parse(await readFile(actor, 'utf8'))

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

console.log(await response.json())

function makeURL (path) {
  return `https://${domain}/${path}`
}

function makeActor () {
  return makeURL(actor)
}

function makeActivity (id, object) {
  return {
    '@context': 'https://www.w3.org/ns/activitystreams',
    type: 'Create',
    id,
    actor: makeActor(),
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
