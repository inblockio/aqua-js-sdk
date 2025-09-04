import { ethers } from 'ethers';
import { getChainIdFromNetwork } from '../utils';
import { CredentialsData, LogData } from '../types';
import { SignerStrategy, SignResult } from '../core/signer-types';

// For React Native environment detection
declare const global: {
    HermesInternal?: object;
};

/**
 * Configuration options for MetaMask signer
 * 
 * @property port - Port number for local server (default: 3000)
 * @property host - Host address for local server (default: 'localhost')
 * @property maxAttempts - Maximum polling attempts (default: 24)
 * @property pollInterval - Interval between polls in ms (default: 5000)
 * @property reactNativeOptions - Options specific to React Native environment
 */
interface MetaMaskSignerOptions {
    port?: number;
    host?: string;
    maxAttempts?: number;
    pollInterval?: number;
    reactNativeOptions?: ReactNativeMetaMaskOptions;
}

/**
 * Configuration options specific to React Native MetaMask integration
 * 
 * @property deepLinkUrl - The deep link URL for the MetaMask mobile app
 * @property callbackUrl - The callback URL that MetaMask will redirect to after signing
 */
interface ReactNativeMetaMaskOptions {
    deepLinkUrl?: string;
    callbackUrl?: string;
    onDeepLinkReady?: (url: string) => void;
}

interface SignatureResult {
    signature: string;
    wallet_address: string;
}

// Define ethereum window type
declare global {
    interface Window {
        ethereum?: {
            isMetaMask?: boolean;
            isConnected: () => boolean;
            selectedAddress: string | null;
            request: (args: { method: string; params?: any[] }) => Promise<any>;
        };
    }
}

/**
 * Handles signing operations using MetaMask wallet
 * 
 * This class provides functionality to sign Aqua Tree revisions using
 * MetaMask wallet in both browser and Node.js environments. In Node.js,
 * it spins up a local server to facilitate MetaMask interaction.
 */
export class MetaMaskSigner implements SignerStrategy {
    private port: number;
    private host: string;
    private serverUrl: string;
    private maxAttempts: number;
    private pollInterval: number;
    private server: any | null; // Type will be http.Server in Node environment
    private lastResult: SignatureResult | null;
    private reactNativeOptions: ReactNativeMetaMaskOptions;

    constructor(options: MetaMaskSignerOptions = {}) {
        this.port = options.port || 3001;
        this.host = options.host || 'localhost';
        this.serverUrl = `http://${this.host}:${this.port}`;
        this.maxAttempts = options.maxAttempts || 24;
        this.pollInterval = options.pollInterval || 5000;
        this.server = null;
        this.lastResult = null;
        this.reactNativeOptions = options.reactNativeOptions || {
            deepLinkUrl: 'metamask://',
            callbackUrl: 'aqua-js-sdk://callback'
        };
    }

    /**
 * Creates a standardized message for signing
 * 
 * @param verificationHash - Hash of the revision to sign
 * @returns Formatted message string
 */
    private createMessage(verificationHash: string): string {
        return `I sign this revision: [${verificationHash}]`;
    }

    /**
 * Creates HTML page for MetaMask interaction
 * 
 * @param message - Message to be signed
 * @returns HTML string with embedded MetaMask integration
 * 
 * This method creates a self-contained HTML page that:
 * - Detects MetaMask presence
 * - Requests account access
 * - Signs message using personal_sign
 * - Posts signature back to local server
 */
    private createHtml(message: string): string {

        return `
        <html>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/ethers/5.6.3/ethers.umd.min.js" type="text/javascript"></script>
          <script>
          const message = "${message}";
          const localServerUrl = window.location.href;
          
          const doSignProcess = async () => {
            const wallet_address = window.ethereum.selectedAddress;
            const correctedWalletAddress = ethers.utils.getAddress(wallet_address)
            console.log("correctedWalletAddress  (case sensetive )=="+correctedWalletAddress)
            const signature = await window.ethereum.request({
              method: 'personal_sign',
              params: [message, window.ethereum.selectedAddress],
            });
            document.getElementById("signature").innerHTML = \`Signature of your file: \${signature} (you may close this tab)\`;
            await fetch(localServerUrl, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({signature, wallet_address: correctedWalletAddress})
            });
          }
          
          if (window.ethereum && window.ethereum.isMetaMask) {
            if (window.ethereum.isConnected() && window.ethereum.selectedAddress) {
              doSignProcess();
            } else {
              window.ethereum.request({ method: 'eth_requestAccounts' })
                .then(doSignProcess)
                .catch((error) => {
                  console.error(error);
                  alert(error.message);
                });
            }
          } else {
            alert("Metamask not detected");
          }
          </script>
          <body>
            <div id="signature"></div>
          </body>
        </html>
      `;
    }

    /**
 * Handles signing process in browser environment
 * 
 * @param verificationHash - Hash of the revision to sign
 * @returns Promise resolving to [signature, wallet address, public key]
 * 
 * This method:
 * - Checks for MetaMask presence
 * - Requests account access
 * - Signs message using MetaMask
 * - Recovers public key from signature
 */
    private async signInBrowser(verificationHash: string, network: string): Promise<[string, string, string]> {
        if (!window.ethereum || !window.ethereum.isMetaMask) {
            throw new Error("MetaMask not detected");
        }

        const message = this.createMessage(verificationHash);

        try {
            // Switch to the specified network first
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: getChainIdFromNetwork(network) }],
            });

            await window.ethereum.request({ method: 'eth_requestAccounts' });
            const _walletAddress = window.ethereum.selectedAddress;
            console.log(`walletAddress ${_walletAddress} if has caps`)


            // Get the raw address from MetaMask
            const rawWalletAddress = window.ethereum.selectedAddress;

            if (!rawWalletAddress) {
                throw new Error("No wallet address selected");
            }

            const { ethers } = await import('ethers');

            const walletAddress = ethers.getAddress(rawWalletAddress);

            if (!walletAddress) {
                throw new Error("No wallet address selected");
            }

            const signature = await window.ethereum.request({
                method: 'personal_sign',
                params: [message, walletAddress],
            });

            const publicKey = await this.recoverPublicKey(message, signature);
            return [signature, walletAddress, publicKey];
        } catch (error) {
            throw error;
        }
    }

    /**
 * Handles signing process in Node.js environment
 * 
 * @param verificationHash - Hash of the revision to sign
 * @returns Promise resolving to [signature, wallet address, public key]
 * 
 * This method:
 * - Creates local HTTP server
 * - Serves HTML page for MetaMask interaction
 * - Polls for signature completion
 * - Cleans up server after signing
 */
    private async signInNode(verificationHash: string): Promise<[string, string, string]> {
        // Dynamic imports for Node environment
        const { createHttpServer } = await import('../platform');
        const message = this.createMessage(verificationHash);
        const html = this.createHtml(message);
        const server = await createHttpServer(this.createRequestListener(html));
        
        if (!server) {
          throw new Error('Failed to create HTTP server. This feature may not be supported in React Native.');
        }
        
        this.server = server;

        return new Promise((resolve, reject) => {
            try {
                this.server.listen(this.port, this.host, () => {
                    console.log(`Server is running on ${this.serverUrl}`);
                });

                this.pollForSignature(message)
                    .then(resolve)
                    .catch(reject)
                    .finally(() => {
                        this.server.close();
                    });
            } catch (error) {
                this.server.close();
                reject(error);
            }
        });
    }

    /**
 * Creates HTTP request listener for local server
 * 
 * @param html - HTML content to serve
 * @returns Request listener function
 * 
 * This method handles:
 * - GET / - Serves signing page
 * - GET /result - Returns current signature status
 * - POST / - Receives signature from browser
 */
    private createRequestListener(html: string): (req: any, res: any) => void {
        return (req: any, res: any) => {
            if (req.method === 'GET' && req.url === '/') {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(html);
            } else if (req.method === 'GET' && req.url === '/result') {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(this.lastResult || {}));
            } else if (req.method === 'POST') {
                let body = '';
                req.on('data', (chunk: string) => body += chunk);
                req.on('end', () => {
                    this.lastResult = JSON.parse(body);
                    res.writeHead(200);
                    res.end('OK');
                });
            }
        };
    }

    /**
 * Polls for signature completion
 * 
 * @param message - Original message being signed
 * @returns Promise resolving to [signature, wallet address, public key]
 * 
 * This method:
 * - Checks for signature at regular intervals
 * - Times out after maxAttempts
 * - Recovers public key when signature is received
 */
    private async pollForSignature(message: string): Promise<[string, string, string]> {
        let attempts = 0;

        while (attempts < this.maxAttempts) {
            if (this.lastResult && this.lastResult.signature) {
                const { signature, wallet_address } = this.lastResult;
                const cleanedAddress = ethers.getAddress(wallet_address)
                const publicKey = await this.recoverPublicKey(message, signature);
                return [signature, cleanedAddress, publicKey];
            }

            console.log("Waiting for the signature...");
            attempts++;
            await this.sleep(this.pollInterval);
        }

        throw new Error("Signature timeout: No response from MetaMask");
    }

    /**
 * Recovers public key from signature
 * 
 * @param message - Original signed message
 * @param signature - Ethereum signature
 * @returns Promise resolving to public key
 * 
 * Uses ethers.js to recover the public key from
 * the signature and message hash.
 */
    private async recoverPublicKey(message: string, signature: string): Promise<string> {
        const { ethers } = await import('ethers');
        return ethers.SigningKey.recoverPublicKey(
            ethers.hashMessage(message),
            signature
        );
    }

    private sleep(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
 * Handles signing process in React Native environment
 * 
 * @param verificationHash - Hash of the revision to sign
 * @param network - Ethereum network to use
 * @returns Promise resolving to [signature, wallet address, public key]
 * 
 * This method:
 * - Creates a deep link to open MetaMask mobile app
 * - Returns a promise that resolves when the signature is received
 * - Recovers public key from signature
 */
private async signInReactNative(verificationHash: string, network: string): Promise<[string, string, string]> {
    const message = this.createMessage(verificationHash);
    const chainId = getChainIdFromNetwork(network);
    
    // Create a deep link to MetaMask mobile app
    const encodedMessage = encodeURIComponent(message);
    
    // MetaMask mobile uses a different format for deep links
    // Try the ethereum/sign format which is more reliable for direct signing
    const deepLink = `metamask://ethereum/sign?message=${encodedMessage}&chainId=${chainId}&callbackUrl=${encodeURIComponent(this.reactNativeOptions.callbackUrl)}`;
        
    // Return a promise that resolves when the signature is received
    return new Promise((resolve, reject) => {
        // Set a timeout to reject the promise if no signature is received
        const timeoutId = setTimeout(() => {
            reject(new Error('Signature timeout: No response from MetaMask'));
        }, this.maxAttempts * this.pollInterval);
        
        // Store the resolve and reject functions to be called when the signature is received
        // This would typically be done in a global state or context in a real app
        (global as any).__aquaMetaMaskResolve = async (signature: string, address: string) => {
            clearTimeout(timeoutId);
            try {
                const cleanedAddress = ethers.getAddress(address);
                const publicKey = await this.recoverPublicKey(message, signature);
                resolve([signature, cleanedAddress, publicKey]);
            } catch (error) {
                    reject(error);
                }
            };
            
            (global as any).__aquaMetaMaskReject = (error: Error) => {
                clearTimeout(timeoutId);
                reject(error);
            };
            
            // Notify caller that deep link is ready
            if (this.reactNativeOptions.onDeepLinkReady) {
                this.reactNativeOptions.onDeepLinkReady(deepLink);
            }
        });
    }

    /**
     * Validates credentials for MetaMask signing
     * 
     * @param credentials - Credentials data
     * @param identCharacter - Identifier character for logging
     * @returns Array of validation errors (empty if valid)
     */
    public validate(_credentials: CredentialsData, _identCharacter: string): LogData[] {
        return []
    }

    /**
 * Signs a verification hash using MetaMask (SignerStrategy interface)
 * 
 * @param targetRevisionHash - Hash of the revision to sign
 * @param credentials - Credentials data
 * @param reactNativeOptions - React Native options
 * @returns Promise resolving to SignResult
 */
    public async sign(targetRevisionHash: string, credentials: CredentialsData, reactNativeOptions?: ReactNativeMetaMaskOptions): Promise<SignResult> {
        this.reactNativeOptions = { ...this.reactNativeOptions, ...reactNativeOptions }
        const [signature, walletAddress, publicKey] = await this.signWithNetwork(targetRevisionHash, credentials.witness_eth_network)
        return {
            signature,
            walletAddress,
            publicKey,
            signatureType: "ethereum:eip-191"
        }
    }

    /**
 * Signs a verification hash using MetaMask (legacy interface)
 * 
 * @param verificationHash - Hash of the revision to sign
 * @param network - Ethereum network
 * @returns Promise resolving to [signature, wallet address, public key]
 * 
 * This method:
 * - Detects environment (Node.js, browser, or React Native)
 * - Routes to appropriate signing method
 * - Returns complete signature information
 */
    public async signWithNetwork(verificationHash: string, network: string): Promise<[string, string, string]> {
        // Detect React Native environment
        const isReactNative = typeof global !== 'undefined' && !!global.HermesInternal;
        const isNode = typeof window === 'undefined' && !isReactNative;
        
        if (isReactNative) {
            return this.signInReactNative(verificationHash, network);
        } else if (isNode) {
            return this.signInNode(verificationHash);
        } else {
            return this.signInBrowser(verificationHash, network);
        }
    }
}