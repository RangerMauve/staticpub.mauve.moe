import { readFile } from 'node:fs/promises'

const domain = 'staticpub.mauve.moe'
const username = "mauve"
const post = 'helloworld.jsonld'
const actor = 'about.jsonld'
const outbox = `https://social.dp.chanterelle.xyz/v1/@${username}@${domain}/outbox`

const postContent = JSON.parse(await readFile(post, 'utf8'))
const actorData = JSON.parse(await readFile(actor, 'utf8'))

const response = await fetch(outbox, {
  method: 'post',
  headers: {
    'Content-Type': 'application/ld+json'
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
