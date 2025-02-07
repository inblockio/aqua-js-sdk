interface MetaMaskSignerOptions {
    port?: number;
    host?: string;
    maxAttempts?: number;
    pollInterval?: number;
}
declare global {
    interface Window {
        ethereum?: {
            isMetaMask?: boolean;
            isConnected: () => boolean;
            selectedAddress: string | null;
            request: (args: {
                method: string;
                params?: any[];
            }) => Promise<any>;
        };
    }
}
export declare class MetaMaskSigner {
    private port;
    private host;
    private serverUrl;
    private maxAttempts;
    private pollInterval;
    private server;
    private lastResult;
    constructor(options?: MetaMaskSignerOptions);
    private createMessage;
    private createHtml;
    private signInBrowser;
    private signInNode;
    private createRequestListener;
    private pollForSignature;
    private recoverPublicKey;
    private sleep;
    sign(verificationHash: string): Promise<[string, string, string]>;
}
export {};
