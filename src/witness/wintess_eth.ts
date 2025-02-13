import { ethers } from 'ethers';
import { LogData, LogType, TransactionResult, WitnessConfig, WitnessEnvironment, WitnessNetwork, WitnessTransactionData } from '../types';
import http from "http";

export class WitnessEth {
  // Internal Configuration Maps
  private static readonly ethChainIdMap: Record<WitnessNetwork, string> = {
    mainnet: '0x1',
    sepolia: '0xaa36a7',
    holesky: '0x4268',
  };

  // Utility Methods
  private static sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // Environment detection
  private static detectEnvironment(): WitnessEnvironment {
    //@ts-ignore
    return typeof window !== 'undefined' && window.ethereum
      ? "browser"
      : 'node'
  };

  static async witnessMetamask(config: WitnessConfig) {
    const environment = this.detectEnvironment();

    try {
      switch (environment) {
        case "browser":
          return await this.browserWitness(config);
        case "node":
          return await this.nodeWitnessMetamask(config);
        default:
          throw new Error('Unsupported environment');
      }
    } catch (error) {
      console.error('Witness error:', error);
      throw error;
    }
  };

  static async commonPrepareListener(htmlContent: string) {
    let output = "{}"
    const requestListener = async (req, res) => {
      if (req.method == "POST") {
        let data = ""
        req.on("data", (chunk) => {
          data += chunk
        })
        await new Promise((resolve) => {
          req.on("end", resolve)
        })
        output = data
        res.writeHead(200)
        res.end()
      } else {
        if (req.url === "/result") {
          res.writeHead(200)
          res.end(output)
          return
        }
        res.setHeader("Content-Type", "text/html")
        res.writeHead(200)
        res.end(htmlContent)
      }
    }
    return requestListener
  }

  // Metamask Witness Method
  static async nodeWitnessMetamask(
    config: WitnessConfig,
    port: number = 8420,
    host: string = 'localhost'
  ): Promise<WitnessTransactionData> {
    const serverUrl = `http://${host}:${port}`;
    const html = this.generateWitnessHtml(config);


    const requestListener = await this.commonPrepareListener(html)
    const server = http.createServer(requestListener)
    server.listen(port, host, () => {
      console.log(`✨ Server is running on ${serverUrl}`)
    })
    let response, content
    while (true) {
      response = await fetch(serverUrl + "/result")
      content = await response.json()
      if (content.transaction_hash) {
        const transactionHash = content.transaction_hash
        const walletAddress = content.wallet_address
        console.log(`The witness tx hash has been retrieved: ${transactionHash}`)
        server.close();
        let data: WitnessTransactionData = {
          transaction_hash: transactionHash,
          wallet_address: walletAddress
        }
        return Promise.resolve(data);
      }
      console.log("Waiting for the witness...")
      await this.sleep(10000)
    }
    // const server = http.createServer((req: any, res: any) => {
    //   let output: any = '{}';

    //   if (req.method === 'POST') {
    //     let data = '';
    //     req.on('data', (chunk: string) => {
    //       data += chunk;
    //     });
    //     req.on('end', () => {
    //       output = JSON.parse(data);
    //       res.writeHead(200, { 'Content-Type': 'application/json' });
    //       res.end(JSON.stringify(output));
    //     });
    //   } else if (req.url === '/result') {
    //     res.writeHead(200, { 'Content-Type': 'application/json' });
    //     res.end(JSON.stringify(output));
    //   } else {
    //     res.setHeader('Content-Type', 'text/html');
    //     res.writeHead(200);
    //     res.end(html);
    //   }
    // });

    // return new Promise((resolve, reject) => {
    //   server.listen(port, host, async () => {
    //     console.log(` Server is running on ${serverUrl}`)
    //     try {
    //       while (true) {
    //         const response = await fetch(`${serverUrl}/result`);
    //         const content: WitnessTransactionData = await response.json();

    //         if (content.transaction_hash) {
    //           server.close();
    //           resolve(content);
    //           break;
    //         }

    //         console.log('Waiting for the witness...');
    //         await this.sleep(10000);
    //       }
    //     } catch (error) {
    //       server.close();
    //       reject(error);
    //     }
    //   });
    // });
  }

  // Browser-specific implementation
  static async browserWitness(config: WitnessConfig): Promise<WitnessTransactionData> {
    const ethChainIdMap: Record<string, string> = {
      'mainnet': '0x1',
      'sepolia': '0xaa36a7',
      'holesky': '0x4268',
    };

    //@ts-ignore
    if (!window.ethereum?.isMetaMask) {
      throw new Error("MetaMask not detected");
    }

    //@ts-ignore
    await window.ethereum.enable();
    //@ts-ignore
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    const walletAddress = accounts[0];

    // Chain ID check and switch if needed
    //@ts-ignore
    const chainId = await window.ethereum.request({ method: 'eth_chainId' });
    const requestedChainId = ethChainIdMap[config.witnessNetwork];

    if (requestedChainId !== chainId) {
      //@ts-ignore
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: requestedChainId }],
      });
    }

    // Send transaction
    const params = [{
      from: walletAddress,
      to: config.smartContractAddress,
      data: '0x9cef4ea1' + config.witnessEventVerificationHash.replace(/^0x/, ''),
    }];

    //@ts-ignore
    const transactionHash = await window.ethereum.request({
      method: 'eth_sendTransaction',
      params: params,
    });

    return {
      transaction_hash: transactionHash,
      wallet_address: walletAddress
    };
  };


  // Generate Witness HTML for Metamask
  private static generateWitnessHtml(config: WitnessConfig): string {
    return `
    <html>
      <script type="module">
        const witnessNetwork = "${config.witnessNetwork}"
        const smart_contract_address = "${config.smartContractAddress}"
        const witness_event_verification_hash = "${config.witnessEventVerificationHash}"
        const localServerUrl = window.location.href;

        const doWitness = async (wallet_address) => {
          const chainId = await window.ethereum.request({ method: 'eth_chainId' })
          const requestedChainId = ${JSON.stringify(this.ethChainIdMap)}[witnessNetwork]
          
          if (requestedChainId !== chainId) {
            await window.ethereum.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: requestedChainId }],
            })
          }

          const params = [{
            from: wallet_address,
            to: smart_contract_address,
            data: '0x9cef4ea1' + witness_event_verification_hash.replace(/^0x/, ''),
          }]

          const transaction_hash = await window.ethereum.request({
            method: 'eth_sendTransaction',
            params: params,
          })

          document.getElementById("transaction_hash").innerHTML = 
            \`Transaction hash of the witness network: \${transaction_hash} (you may close this tab)\`
          
          await fetch(localServerUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ transaction_hash, wallet_address })
          })
        }

        if (window.ethereum && window.ethereum.isMetaMask) {
          window.ethereum.request({ method: 'eth_requestAccounts' }).then(async (accounts) => {
            await doWitness(accounts[0])
          })
        } else {
          alert("Metamask not detected")
        }
      </script>
      <body>
        <div id="transaction_hash"></div>
      </body>
    </html>
    `;
  }

  // CLI Witness Method
  static async witnessCli(
    walletPrivateKey: string,
    witnessEventVerificationHash: string,
    smartContractAddress: string,
    WitnessNetwork: WitnessNetwork,
    providerUrl?: string
  ): Promise<[TransactionResult, Array<LogData>]> {
    const logData: LogData[] = []
    try {
      const provider = providerUrl
        ? new ethers.JsonRpcProvider(providerUrl)
        : ethers.getDefaultProvider(WitnessNetwork);

      const wallet = new ethers.Wallet(walletPrivateKey, provider);
      const sender = wallet.address;

      console.log(`Using wallet: ${sender}`);

      if (!witnessEventVerificationHash.startsWith('0x')) {
        throw new Error("Invalid witness verification hash: must start with '0x'");
      }

      const tx = {
        from: sender,
        to: smartContractAddress,
        data: `0x9cef4ea1${witnessEventVerificationHash.slice(2)}`,
      };

      const balance = await provider.getBalance(sender);
      const balanceInEth = ethers.formatEther(balance);
      // console.log(`Sender Balance: ${balanceInEth} ETH`);

      // const estimatedGas = await provider.estimateGas(tx);
      // console.log(`Estimated Gas: ${estimatedGas.toString()} units`);

      // const feeData = await provider.getFeeData();
      // const gasPrice = feeData.gasPrice ?? BigInt(0);
      // console.log(`Gas Price: ${ethers.formatUnits(gasPrice, 'gwei')} Gwei`);

      // const gasCost = estimatedGas * gasPrice;
      // const gasCostInEth = ethers.formatEther(gasCost);
      // console.log(`Estimated Gas Fee: ${gasCostInEth} ETH`);

      logData.push({
        log: `Sender Balance: ${balanceInEth} ETH`,
        logType: LogType.DEBUGDATA
      })

      // Estimate gas
      const estimatedGas = await provider.estimateGas(tx);

      logData.push({
        log: `Estimated Gas: ${estimatedGas.toString()} units`,
        logType: LogType.DEBUGDATA
      })

      // Get current gas price
      const feeData = await provider.getFeeData();

      logData.push({
        log: `Fee data: ", ${feeData}`,
        logType: LogType.DEBUGDATA
      })

      const gasPrice = feeData.gasPrice ?? BigInt(0);

      logData.push({
        log: `Gas Price: ${ethers.formatUnits(gasPrice, "gwei")} Gwei`,
        logType: LogType.DEBUGDATA
      })

      // Calculate total gas fee
      const gasCost = estimatedGas * gasPrice;
      const gasCostInEth = ethers.formatEther(gasCost);

      logData.push({
        log: `Estimated Gas Fee: ${gasCostInEth} ETH`,
        logType: LogType.DEBUGDATA
      })

      if (balance < gasCost) {
        logData.push({
          log: `Estimated Gas Fee: ${gasCostInEth} ETH`,
          logType: LogType.DEBUGDATA
        })
        throw new Error('Insufficient balance for gas fee.');
      }

      const signedTx = await wallet.sendTransaction({
        ...tx,
        gasLimit: estimatedGas,
        gasPrice: gasPrice,
      });

      logData.push({
        log: `Transaction sent! Hash: ${signedTx.hash}`,
        logType: LogType.DEBUGDATA
      })

      return [{ error: null, transactionHash: signedTx.hash }, logData];
    } catch (error) {
      logData.push({
        log: `Error sending transaction:', ${error}`,
        logType: LogType.ERROR
      })
      return [{ error: (error as Error).message }, logData];
    }
  }

  // Verify Transaction Method
  static async verify(
    WitnessNetwork: WitnessNetwork,
    transactionHash: string,
    expectedMR: string,
    _expectedTimestamp?: number
  ): Promise<[boolean, string]> {
    const provider = ethers.getDefaultProvider(WitnessNetwork);

    const tx = await provider.getTransaction(transactionHash);
    if (!tx) {
      return [false, 'Transaction not found']
    };

    let actual = tx.data.split('0x9cef4ea1')[1];
    actual = actual.slice(0, 128);

    await this.sleep(200); // prevent overloading free endpoint

    const mrSans0x = expectedMR.startsWith('0x') ? expectedMR.slice(2) : expectedMR;
    return [actual === mrSans0x, `${actual === mrSans0x ? 'Transaction found' : ' Transaction not valid'}`];
  }
}
