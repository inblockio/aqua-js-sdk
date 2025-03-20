
# Aqua Verifier 
Aqua protocol js/ts library for intergration with your code.
check out [aqua-protocol](https://aqua-protocol.org/) documentation

## Usage
Ensure to use the same semantic version as the Aqua protocol version you are using for example
* use version 1.2.XX with aqua protocol version 1.2.

## Example 
Check the example folder to see an example project

## Installation
```bash
npm install aqua-verifier
```
//todo add browser support if possible


## Usage

```typescript
import { AquaVerifier } from 'aqua-verifier';
```

##  Requirements


## local development
You can use the library without having to install it from npm
1. run `npm run build`
2. run `npm link`

in you aqua-container or any other project run `npm  link aqua-verifier` .
optional to unlink remove this library `npm unlink aqua-verifier`
