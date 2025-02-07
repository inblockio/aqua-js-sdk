import { TransactionResult, WitnessConfig, WitnessNetwork, WitnessTransactionData } from '../types';
export declare class WitnessEth {
    private static readonly ethChainIdMap;
    private static sleep;
    private static detectEnvironment;
    static witnessMetamask(config: WitnessConfig): Promise<WitnessTransactionData>;
    static nodeWitnessMetamask(config: WitnessConfig, port?: number, host?: string): Promise<WitnessTransactionData>;
    static browserWitness(config: WitnessConfig): Promise<WitnessTransactionData>;
    private static generateWitnessHtml;
    static witnessCli(walletPrivateKey: string, witnessEventVerificationHash: string, smartContractAddress: string, WitnessNetwork: WitnessNetwork, providerUrl?: string): Promise<TransactionResult>;
    static verify(WitnessNetwork: WitnessNetwork, transactionHash: string, expectedMR: string, expectedTimestamp?: number): Promise<string>;
}
