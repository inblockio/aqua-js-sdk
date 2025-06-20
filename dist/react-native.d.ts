import Aquafier from './index.js';
export { AnObject, AquaOperationData, AquaTree, AquaTreeAndFileObject, AquaTreeWrapper, AquafierChainable, CredentialsData, Err, ErrResult, FileIndex, FileObject, FileVerificationGraphData, FormData, FormKeyGraphData, FormVerificationGraphData, FormVerificationResponseData, GasEstimateResult, IWitnessConfig, LinkVerificationGraphData, LogData, LogType, LogTypeEmojis, None, NoneOption, Ok, OkResult, Option, OrderRevisionInAquaTree, ReactNativeMetaMaskOptions, Result, Revision, RevisionGraphInfo, RevisionTree, RevisionType, Revisions, SignType, SignatureData, SignatureItem, SignaturePayload, SignatureResult, SignatureVerificationGraphData, Some, SomeOption, TransactionResult, TreeMapping, VerificationGraphData, WitnessConfig, WitnessEnvironment, WitnessEthResponse, WitnessMerkleProof, WitnessNetwork, WitnessNostrResponse, WitnessNostrVerifyResult, WitnessPlatformType, WitnessResult, WitnessTSAResponse, WitnessTransactionData, WitnessType, WitnessVerificationGraphData, checkFileHashAlreadyNotarized, checkInternetConnection, cliGreenify, cliRedify, cliYellowfy, createCredentials, createNewAquaTree, dict2Leaves, estimateWitnessGas, findFormKey, findNextRevisionHashByArrayofRevisions, formatMwTimestamp, getAquaTreeFileName, getAquaTreeFileObject, getChainIdFromNetwork, getEntropy, getFileHashSum, getFileNameCheckingPaths, getGenesisHash, getHashSum, getLatestVH, getMerkleRoot, getPreviousVerificationHash, getTimestamp, getWallet, isAquaTree, isErr, isNone, isOk, isSome, log_dim, log_red, log_success, log_yellow, maybeUpdateFileIndex, prepareNonce, printGraphData, printLogs, printlinkedGraphData, recoverWalletAddress, reorderAquaTreeRevisionsProperties, reorderRevisionsProperties, verifyMerkleIntegrity } from './index.js';
import 'ethers';

/**
 * React Native entry point for aqua-js-sdk
 *
 * This file provides a React Native compatible version of the aqua-js-sdk library.
 * It exports all the same functionality as the main library but uses platform-specific
 * implementations that are compatible with React Native.
 */

export { Aquafier as default };
