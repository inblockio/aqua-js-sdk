import { finalizeEvent, Event, EventTemplate, getPublicKey, Relay, nip19 } from 'nostr-tools'
import { hexToBytes } from '@noble/hashes/utils'
import { CredentialsData, WitnessNostrVerifyResult } from '../types'
import ws from 'ws';



/**
 * Handles Nostr-based witnessing operations for Aqua Protocol
 * 
 * This class provides functionality to witness and verify Aqua Tree revisions
 * using the Nostr protocol. It supports both browser and Node.js environments
 * and uses the nostr-tools library for Nostr operations.
 */
export class WitnessNostr {
    /**
 * Waits for an event from a specific author on a Nostr relay
 * 
 * @param relay - Connected Nostr relay instance
 * @param pk - Public key of the author to watch
 * @returns Promise resolving to the received Nostr event
 * 
 * This method:
 * - Subscribes to kind 1 events from specific author
 * - Returns first matching event received
 */
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

    /**
 * Waits for a specific event by ID on a Nostr relay
 * 
 * @param relay - Connected Nostr relay instance
 * @param id - Event ID to watch for
 * @returns Promise resolving to the received Nostr event
 * 
 * This method:
 * - Subscribes to events with specific ID
 * - Returns first matching event received
 */
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

        // Check if we're in Node.js environment
        const isNode = typeof window === 'undefined';

        let websocket: typeof WebSocket;
        // Set WebSocket implementation based on environment
        // node does not have native wbsocket 
        if (isNode) {

            websocket = ws as unknown as typeof WebSocket;
            global.WebSocket = websocket;
        }

        console.log("Is node: ", isNode)


        const relay = await Relay.connect(relayUrl);

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
        const relayUrl = 'wss://relay.damus.io'

        if (decoded.type !== "nevent") {
            return false
        }

        // const relay = await Relay.connect('wss://relay.damus.io')
        // Check if we're in Node.js environment
        const isNode = typeof window === 'undefined';

        let websocket: typeof WebSocket;
        // Set WebSocket implementation based on environment
        // node does not have native wbsocket 
        if (isNode) {

            websocket = ws as unknown as typeof WebSocket;
            global.WebSocket = websocket;
        }

        console.log("Is node: ", isNode)


        const relay = await Relay.connect(relayUrl);

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