import { Event } from 'nostr-tools/pure';
import { Relay } from 'nostr-tools/relay';
import { CredentialsData } from '../types';
export declare class WitnessNostr {
    waitForEventAuthor: (relay: Relay, pk: string) => Promise<Event>;
    waitForEventId: (relay: Relay, id: string) => Promise<Event>;
    witness: (witnessEventVerificationHash: string, credentials: CredentialsData) => Promise<[string, string, number]>;
    verify: (transactionHash: string, expectedMR: string, expectedTimestamp: number) => Promise<boolean>;
}
