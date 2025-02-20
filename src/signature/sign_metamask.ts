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

export class MetaMaskSigner {
    private port: number;
    private host: string;
    private serverUrl: string;
    private maxAttempts: number;
    private pollInterval: number;
    private server: any | null; // Type will be http.Server in Node environment
    private lastResult: SignatureResult | null;

    constructor(options: MetaMaskSignerOptions = {}) {
        this.port = options.port || 3000;
        this.host = options.host || 'localhost';
        this.serverUrl = `http://${this.host}:${this.port}`;
        this.maxAttempts = options.maxAttempts || 24;
        this.pollInterval = options.pollInterval || 5000;
        this.server = null;
        this.lastResult = null;
    }

    private createMessage(verificationHash: string): string {
        return `I sign this revision: [${verificationHash}]`;
    }

    private createHtml(message: string): string {
        return `
        <html>
          <script>
          const message = "${message}";
          const localServerUrl = window.location.href;
          
          const doSignProcess = async () => {
            const wallet_address = window.ethereum.selectedAddress;
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
              body: JSON.stringify({signature, wallet_address})
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

    private async pollForSignature(message: string): Promise<[string, string, string]> {
        let attempts = 0;

        while (attempts < this.maxAttempts) {
            if (this.lastResult.signature) {
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

    public async sign(verificationHash: string): Promise<[string, string, string]> {
        const isNode = typeof window === 'undefined';
        return isNode ?
            this.signInNode(verificationHash) :
            this.signInBrowser(verificationHash);
    }
}