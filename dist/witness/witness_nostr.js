import { getPublicKey } from 'nostr-tools/pure';
import { finalizeEvent } from 'nostr-tools/pure';
import { Relay } from 'nostr-tools/relay';
import { hexToBytes } from '@noble/hashes/utils';
import * as nip19 from 'nostr-tools/nip19';
export class WitnessNostr {
    constructor() {
        this.waitForEventAuthor = async (relay, pk) => {
            return new Promise((resolve) => {
                relay.subscribe([
                    {
                        kinds: [1],
                        authors: [pk],
                    },
                ], {
                    onevent(event) {
                        resolve(event);
                    }
                });
            });
        };
        this.waitForEventId = async (relay, id) => {
            return new Promise((resolve) => {
                relay.subscribe([
                    {
                        ids: [id],
                    },
                ], {
                    onevent(event) {
                        resolve(event);
                    }
                });
            });
        };
        this.witness = async (witnessEventVerificationHash, credentials) => {
            // if (credentials.nostr_sk == undefined || credentials.nostr_sk == null || credentials.nostr_sk.length == 0) {
            //     return Err("nostr_sk in credntial is missing or empty")
            // }
            const skHex = credentials.nostr_sk;
            const relayUrl = 'wss://relay.damus.io';
            if (!skHex) {
                throw new Error("Nostr SK key is required. Please get an API key from https://snort.social/login/sign-up");
            }
            const sk = hexToBytes(skHex);
            const pk = getPublicKey(sk);
            const npub = nip19.npubEncode(pk);
            console.log("npub: ", npub);
            console.log("Witness event verification hash: ", witnessEventVerificationHash);
            console.log(`https://snort.social/${npub}`);
            const eventTemplate = {
                kind: 1,
                created_at: Math.floor(Date.now() / 1000),
                tags: [],
                content: witnessEventVerificationHash,
            };
            const event = finalizeEvent(eventTemplate, sk);
            const relay = await Relay.connect(relayUrl);
            console.log(`connected to ${relay.url}`);
            await relay.publish(event);
            const publishEvent = await this.waitForEventAuthor(relay, pk);
            relay.close();
            const nevent = nip19.neventEncode({
                id: publishEvent.id,
                relays: [relay.url],
                author: publishEvent.pubkey
            });
            const witnessTimestamp = publishEvent.created_at;
            console.log(`got event https://snort.social/${nevent}`);
            return [nevent, npub, witnessTimestamp];
        };
        this.verify = async (transactionHash, expectedMR, expectedTimestamp) => {
            const decoded = nip19.decode(transactionHash);
            if (decoded.type !== "nevent") {
                return false;
            }
            const relay = await Relay.connect('wss://relay.damus.io');
            const publishEvent = await this.waitForEventId(relay, decoded.data.id);
            relay.close();
            if (expectedTimestamp !== publishEvent.created_at) {
                return false;
            }
            const merkleRoot = publishEvent.content;
            return merkleRoot === expectedMR;
        };
    }
}
// export {
//     witness,
//     verify,
//     type Credentials,
//     type WitnessResponse,
//     type VerifyResult
// }
