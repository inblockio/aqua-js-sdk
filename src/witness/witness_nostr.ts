import { generateSecretKey, getPublicKey } from 'nostr-tools/pure'
import { finalizeEvent, Event, EventTemplate } from 'nostr-tools/pure'
import { Relay, Subscription } from 'nostr-tools/relay'
import { hexToBytes } from '@noble/hashes/utils'
import * as nip19 from 'nostr-tools/nip19'
import { CredentialsData, WitnessNostrVerifyResult } from '../types'
import { Err, Ok, Result } from 'rustic'





export class WitnessNostr {
     waitForEventAuthor = async (relay: Relay, pk: string): Promise<Event> => {
        return new Promise((resolve) => {
            relay.subscribe([
                {
                    kinds: [1],
                    authors: [pk],
                },
            ], {
                onevent(event: Event) {
                    resolve(event)
                }
            })
        })
    }

     waitForEventId = async (relay: Relay, id: string): Promise<Event> => {
        return new Promise((resolve) => {
            relay.subscribe([
                {
                    ids: [id],
                },
            ], {
                onevent(event: Event) {
                    resolve(event)
                }
            })
        })
    }

     witness = async (witnessEventVerificationHash: string, credentials: CredentialsData): Promise<[string, string, number]> => {

        // if (credentials.nostr_sk == undefined || credentials.nostr_sk == null || credentials.nostr_sk.length == 0) {
        //     return Err("nostr_sk in credntial is missing or empty")
        // }
        const skHex = credentials.nostr_sk
        const relayUrl = 'wss://relay.damus.io'

        if (!skHex) {
            throw new Error("Nostr SK key is required. Please get an API key from https://snort.social/login/sign-up")
        }

        const sk = hexToBytes(skHex)
        const pk = getPublicKey(sk)
        const npub = nip19.npubEncode(pk)

        console.log("npub: ", npub)
        console.log("Witness event verification hash: ", witnessEventVerificationHash)
        console.log(`https://snort.social/${npub}`)

        const eventTemplate: EventTemplate = {
            kind: 1,
            created_at: Math.floor(Date.now() / 1000),
            tags: [],
            content: witnessEventVerificationHash,
        }

        const event = finalizeEvent(eventTemplate, sk)

        const relay = await Relay.connect(relayUrl)
        console.log(`connected to ${relay.url}`)

        await relay.publish(event)
        const publishEvent = await this.waitForEventAuthor(relay, pk)
        relay.close()

        const nevent = nip19.neventEncode({
            id: publishEvent.id,
            relays: [relay.url],
            author: publishEvent.pubkey
        })
        const witnessTimestamp = publishEvent.created_at
        console.log(`got event https://snort.social/${nevent}`)

        return [nevent, npub, witnessTimestamp]
    }



     verify = async (
        transactionHash: string,
        expectedMR: string,
        expectedTimestamp: number
    ): Promise<boolean> => {
        const decoded = nip19.decode(transactionHash) as WitnessNostrVerifyResult

        if (decoded.type !== "nevent") {
            return false
        }

        const relay = await Relay.connect('wss://relay.damus.io')
        const publishEvent = await this.waitForEventId(relay, decoded.data.id)
        relay.close()

        if (expectedTimestamp !== publishEvent.created_at) {
            return false
        }

        const merkleRoot = publishEvent.content
        return merkleRoot === expectedMR
    }
}
// export {
//     witness,
//     verify,
//     type Credentials,
//     type WitnessResponse,
//     type VerifyResult
// }