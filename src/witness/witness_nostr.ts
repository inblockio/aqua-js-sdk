import { finalizeEvent, Event, EventTemplate, getPublicKey } from 'nostr-tools/pure'
import { Relay } from 'nostr-tools/relay'
import { hexToBytes } from '@noble/hashes/utils'
import * as nip19 from 'nostr-tools/nip19'
import { CredentialsData, WitnessNostrVerifyResult } from '../types'
import ws from 'ws';



/**
 * Handles Nostr-based witnessing operations for Aqua Protocol
 * 
 * This class provides functionality to witness and verify Aqua Tree revisions
 * using the Nostr protocol. It supports both browser and Node.js environments
 * and uses the nostr-tools library for Nostr operations.
 */
export const NOSTR_RELAYS = [
    'wss://relay.damus.io',
    'wss://nos.lol',
    'wss://relay.nostr.band',
]

export class WitnessNostr {
    /**
 * Waits for an event from a specific author on a Nostr relay
 *
 * @param relay - Connected Nostr relay instance
 * @param pk - Public key of the author to watch
 * @param timeoutMs - Timeout in milliseconds (default 10000)
 * @returns Promise resolving to the received Nostr event
 */
waitForEventAuthor = async (relay: Relay, pk: string, timeoutMs = 10000): Promise<Event> => {
        return new Promise((resolve, reject) => {
            const timer = setTimeout(() => reject(new Error(`Timeout waiting for event from ${pk} on ${relay.url}`)), timeoutMs)
            relay.subscribe([
                {
                    kinds: [1],
                    authors: [pk],
                },
            ], {
                onevent(event: Event) {
                    clearTimeout(timer)
                    resolve(event)
                }
            })
        })
    }

    /**
 * Waits for a specific event by ID on a Nostr relay
 *
 * @param relay - Connected Nostr relay instance
 * @param id - Event ID to watch for
 * @param timeoutMs - Timeout in milliseconds (default 10000)
 * @returns Promise resolving to the received Nostr event
 */
waitForEventId = async (relay: Relay, id: string, timeoutMs = 10000): Promise<Event> => {
        return new Promise((resolve, reject) => {
            const timer = setTimeout(() => reject(new Error(`Timeout waiting for event ${id} on ${relay.url}`)), timeoutMs)
            relay.subscribe([
                {
                    ids: [id],
                },
            ], {
                onevent(event: Event) {
                    clearTimeout(timer)
                    resolve(event)
                }
            })
        })
    }

    /**
 * Connects to the first available relay from the list
 */
connectToRelay = async (relayUrls: string[] = NOSTR_RELAYS): Promise<Relay> => {
        for (const url of relayUrls) {
            try {
                const relay = await Relay.connect(url)
                console.log(`connected to ${relay.url}`)
                return relay
            } catch {
                console.log(`failed to connect to ${url}, trying next...`)
            }
        }
        throw new Error(`Could not connect to any Nostr relay: ${relayUrls.join(', ')}`)
    }

    /**
 * Creates a witness event on Nostr network
 * 
 * @param witnessEventVerificationHash - Hash to be witnessed
 * @param credentials - Credentials containing Nostr secret key
 * @returns Promise resolving to [nevent, npub, timestamp]
 * 
 * This method:
 * - Validates Nostr credentials
 * - Creates and signs Nostr event
 * - Publishes event to relay
 * - Returns event details and timestamp
 * 
 * Uses damus.io relay and supports both browser and Node.js
 * environments with appropriate WebSocket handling.
 */
witness = async (witnessEventVerificationHash: string, credentials: CredentialsData): Promise<[string, string, number]> => {



        // if (credentials.nostr_sk == undefined || credentials.nostr_sk == null || credentials.nostr_sk.length == 0) {
        //     return Err("nostr_sk in credntial is missing or empty")
        // }
        const skHex = credentials.nostr_sk

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

        if (typeof window === 'undefined') {
            global.WebSocket = ws as unknown as typeof WebSocket;
        }

        const relay = await this.connectToRelay()

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



    /**
 * Verifies a Nostr witness event
 * 
 * @param transactionHash - Nostr event identifier (nevent)
 * @param expectedMR - Expected Merkle root
 * @param expectedTimestamp - Expected event timestamp
 * @returns Promise resolving to boolean indicating verification success
 * 
 * This method:
 * - Decodes Nostr event identifier
 * - Retrieves event from relay
 * - Verifies timestamp and content match
 * - Supports both browser and Node.js environments
 */
verify = async (
        transactionHash: string,
        expectedMR: string,
        expectedTimestamp: number
    ): Promise<boolean> => {
        const decoded = nip19.decode(transactionHash) as WitnessNostrVerifyResult

        if (decoded.type !== "nevent") {
            return false
        }

        if (typeof window === 'undefined') {
            global.WebSocket = ws as unknown as typeof WebSocket;
        }

        const relayUrls = decoded.data.relays?.length ? decoded.data.relays : NOSTR_RELAYS
        const relay = await this.connectToRelay(relayUrls)

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