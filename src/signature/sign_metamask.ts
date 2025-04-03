
/**
 * Configuration options for MetaMask signer
 * 
 * @property port - Port number for local server (default: 3000)
 * @property host - Host address for local server (default: 'localhost')
 * @property maxAttempts - Maximum polling attempts (default: 24)
 * @property pollInterval - Interval between polls in ms (default: 5000)
 */
interface MetaMaskSignerOptions {
    port?: number;
    host?: string;
    maxAttempts?: number;
    pollInterval?: number;
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
export class MetaMaskSigner {
    private port: number;
    private host: string;
    private serverUrl: string;
    private maxAttempts: number;
    private pollInterval: number;
    private server: any | null; // Type will be http.Server in Node environment
    private lastResult: SignatureResult | null;

    constructor(options: MetaMaskSignerOptions = {}) {
        this.port = options.port || 3001;
        this.host = options.host || 'localhost';
        this.serverUrl = `http://${this.host}:${this.port}`;
        this.maxAttempts = options.maxAttempts || 24;
        this.pollInterval = options.pollInterval || 5000;
        this.server = null;
        this.lastResult = null;
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
    private async signInBrowser(verificationHash: string): Promise<[string, string, string]> {
        if (!window.ethereum || !window.ethereum.isMetaMask) {
            throw new Error("MetaMask not detected");
        }

        const message = this.createMessage(verificationHash);

        try {
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            const walletAddress = window.ethereum.selectedAddress;

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
        const { createServer } = await import('http');
        const message = this.createMessage(verificationHash);
        const html = this.createHtml(message);

        const requestListener = this.createRequestListener(html);
        this.server = createServer(requestListener);

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
                const publicKey = await this.recoverPublicKey(message, signature);
                return [signature, wallet_address, publicKey];
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
 * Signs a verification hash using MetaMask
 * 
 * @param verificationHash - Hash of the revision to sign
 * @returns Promise resolving to [signature, wallet address, public key]
 * 
 * This method:
 * - Detects environment (Node.js or browser)
 * - Routes to appropriate signing method
 * - Returns complete signature information
 */
    public async sign(verificationHash: string): Promise<[string, string, string]> {
        const isNode = typeof window === 'undefined';
        return isNode ?
            this.signInNode(verificationHash) :
            this.signInBrowser(verificationHash);
    }
}