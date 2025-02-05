// Core witness types and interfaces
import {WitnessEnvironment} from "../types";
  
  class WitnessConfig {
    constructor({
      witnessNetwork,
      smartContractAddress,
      witnessEventVerificationHash,
      port = 8420,
      host = 'localhost'
    }) {
      this.witnessNetwork = witnessNetwork;
      this.smartContractAddress = smartContractAddress;
      this.witnessEventVerificationHash = witnessEventVerificationHash;
      this.port = port;
      this.host = host;
    }
  }
  
  // Environment detection
  const detectEnvironment = () => {
    return typeof window !== 'undefined' && window.ethereum
      ? WitnessEnvironment.BROWSER
      : WitnessEnvironment.NODE;
  };
  
  // Browser-specific implementation
  const browserWitness = async (config) => {
    const ethChainIdMap = {
      'mainnet': '0x1',
      'sepolia': '0xaa36a7',
      'holesky': '0x4268',
    };
  
    if (!window.ethereum?.isMetaMask) {
      throw new Error("MetaMask not detected");
    }
  
    await window.ethereum.enable();
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    const walletAddress = accounts[0];
  
    // Chain ID check and switch if needed
    const chainId = await window.ethereum.request({ method: 'eth_chainId' });
    const requestedChainId = ethChainIdMap[config.witnessNetwork];
    
    if (requestedChainId !== chainId) {
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
  
    const transactionHash = await window.ethereum.request({
      method: 'eth_sendTransaction',
      params: params,
    });
  
    return {
      transactionHash,
      walletAddress
    };
  };
  
  // Node-specific implementation
  const nodeWitness = async (config) => {
    // Import required modules dynamically
    const { createServer } = await import('http');
    
    const htmlContent = `
      <html>
        <script type="module">
          const config = ${JSON.stringify(config)};
          ${browserWitness.toString()}
          (async () => {
            try {
              const result = await browserWitness(config);
              await fetch(window.location.href, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(result)
              });
            } catch (error) {
              document.getElementById("error").textContent = error.message;
            }
          })();
        </script>
        <body>
          <div id="transaction_hash"></div>
          <div id="error" style="color: red;"></div>
        </body>
      </html>
    `;
  
    return new Promise((resolve) => {
      let result = null;
      const server = createServer((req, res) => {
        if (req.method === "POST") {
          let data = "";
          req.on("data", chunk => { data += chunk; });
          req.on("end", () => {
            result = JSON.parse(data);
            res.writeHead(200);
            res.end();
            server.close();
            resolve(result);
          });
        } else {
          res.setHeader("Content-Type", "text/html");
          res.writeHead(200);
          res.end(htmlContent);
        }
      });
  
      server.listen(config.port, config.host, () => {
        console.log(`Server running at http://${config.host}:${config.port}`);
      });
    });
  };
  
  // Main witness function that handles both environments
  const witness = async (config) => {
    const environment = detectEnvironment();
    
    try {
      switch (environment) {
        case WitnessEnvironment.BROWSER:
          return await browserWitness(config);
        case WitnessEnvironment.NODE:
          return await nodeWitness(config);
        default:
          throw new Error('Unsupported environment');
      }
    } catch (error) {
      console.error('Witness error:', error);
      throw error;
    }
  };
  
  // Verification function (environment-agnostic)
  const verify = async (config, transactionHash, expectedMR, expectedTimestamp) => {
    const provider = ethers.getDefaultProvider(config.witnessNetwork);
    const tx = await provider.getTransaction(transactionHash);
    
    if (!tx) return "NOT FOUND";
    
    let actual = tx.data.split("0x9cef4ea1")[1];
    actual = actual.slice(0, 128);
    
    const mrSans0x = expectedMR.slice(0, 2) === "0x" ? expectedMR.slice(2) : expectedMR;
    return `${actual === mrSans0x}`;
  };
  
  export {
    witness,
    verify,
    WitnessConfig,
    WitnessEnvironment
  };