// const isNode = typeof window === "undefined";

// const { ethers, HDNodeWallet, Wallet, Mnemonic } = isNode
//   ? require("ethers") // CommonJS for Node.js
//   : require("https://cdnjs.cloudflare.com/ajax/libs/ethers/6.13.5/ethers.esm.min.js"); // Static import for Browsers

// export { ethers, HDNodeWallet, Wallet, Mnemonic }

// // let ethers: typeof import("ethers");
// // let HDNodeWallet: typeof import("ethers").HDNodeWallet;
// // let Wallet: typeof import("ethers").Wallet;
// // let Mnemonic: typeof import("ethers").Mnemonic;

// // (async () => {
// //   if (typeof window !== "undefined") {
// //     // Browser environment
// //     const module = await import("ethers");
// //     ethers = module;
// //     HDNodeWallet = module.HDNodeWallet;
// //     Wallet = module.Wallet;
// //     Mnemonic = module.Mnemonic;
// //   } else {
// //     // Node.js environment
// //     const module = await import("ethers");
// //     ethers = module;
// //     HDNodeWallet = module.HDNodeWallet;
// //     Wallet = module.Wallet;
// //     Mnemonic = module.Mnemonic;
// //   }
// // })();

// // export { ethers, HDNodeWallet, Wallet, Mnemonic };
