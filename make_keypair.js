import { generateKeypair } from 'http-signed-fetch'
import { writeFile } from 'node:fs/promises'

const keypair = generateKeypair()

await writeFile('keypair.json', JSON.stringify(keypair, null, '\t'))

console.log(keypair)
