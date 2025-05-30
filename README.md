# Aqua Verifier 
JS Client for external verifier.
* An npm library 
* a cli tool to verify aqaua chain json file 

## Usage
Ensure to use the same semantic version as the Aqua protocol version you are using for example
* use version 1.2.XX with aqua protocol version 1.2.


## Installation
```bash
npm install aqua-js-sdk
```

## Usage

```typescript
import Aquafier, {FileObject} from 'aqua-js-sdk';


let aquafier = new Aquafier();

// using node fs module or browser FILE object
// create an aqua file object 
let fileObject : FileObject = {
  fileName: "sample.txt",
  fileContent: "i am a sampl text",
  path: "/sample.txt" // optional if in browser environment
}
let aquaTreeObjectResult = await aquafier.createGenesisRevision(fileObject);

if(isErr(aquaTreeObjectResult)){
    console.err(" ---- An error occured  ---- ");
    aquaTreeObjectResult.logData.forEach((e) => console.log(e));
    return
}
let aquaTreeObject = aquaTreeObjectResult.data

// aquaTreeObject can be saved in db or aqua.json

```

##  Requirements
Node.js v20.9.0


## local development
You can use the library without having to instal it from npm
1. run `npm install`
2. run `npm run build`
3. run `npm link`

in you aqua-container or any other project run `npm  link aqua-verifier` .
optional to unlink remove this library `npm unlink aqua-verifier`

## Testing 

Ensure to create `credentials.json` file in src the contents should be 

```
{
    "mnemonic": "",
    "nostr_sk": "",
    "did_key": "",
    "alchemy_key": "",
    "witness_eth_network": "",
    "witness_method": ""
}
```
Purpose of each property :

1. mnemonic enables us to construct your wallet address The menemonic could be from metamask or a cli wallet.
2.  nostr_sk is needed as it you can witne via nostr
3. Aqua provides the ability to sign via did, to use did a did key is required.
4. when verifying a witness the alchemy key enables aqua to do an alchemy loopkup of the  transaction hash.
5. witness_eth_network is used to switch networks ie among : mainnet, sepolia, holesky.
6. witness_method is used to instruct aqua to use metamask or cli when witness, ie in some everonments metamask is not available , cli will use menomonic from credentials to construct a wallet.

Run `npm test` to ru tests

### Running a single file test

Run aquafier tests

```bash
npm test -- ./tests/aquafier.test.ts
```

or

Run p12 tests

```bash
npm test -- ./tests/p12.test.ts
```






