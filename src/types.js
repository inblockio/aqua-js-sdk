/**
 * @module types
 * @description This module contains all the types used in the Aqua SDK
 * @preferred @description This module contains all the types used in the Aqua SDK
 * @preferred @exports {CredentialsData, AquaOperationData, RevisionType, WitnessType, WitnessPlatformType, WitnessNetwork, SignType, WitnessEnvironment, FileObject, LogType, LogTypeEmojis, LogData, RevisionTree, Revision, Revisions, FileIndex, FormData, TreeMapping, AquaTreeView, AquaTree, SignaturePayload, SignatureResult, SignatureData, SignatureItem, IWitnessConfig, AnObject, WitnessMerkleProof, WitnessResult, GasEstimateResult, WitnessConfig, TransactionResult, WitnessTransactionData, WitnessTSAResponse, WitnessEthResponse, WitnessNostrResponse, WitnessNostrVerifyResult}
 */
/**
 * Types of log messages
 * Used for categorizing and formatting logs
 */
export var LogType;
(function (LogType) {
    LogType["SUCCESS"] = "success";
    LogType["INFO"] = "info";
    LogType["ERROR"] = "error";
    LogType["FINAL_ERROR"] = "final_error";
    LogType["WARNING"] = "warning";
    LogType["HINT"] = "hint";
    LogType["DEBUGDATA"] = "debug_data";
    LogType["ARROW"] = "arrow";
    LogType["FILE"] = "file";
    LogType["LINK"] = "link";
    LogType["SIGNATURE"] = "signature";
    LogType["WITNESS"] = "witness";
    LogType["FORM"] = "form";
    LogType["SCALAR"] = "scalar";
    LogType["EMPTY"] = "empty";
    LogType["TREE"] = "tree";
})(LogType || (LogType = {}));
export const LogTypeEmojis = {
    [LogType.SUCCESS]: "✅",
    [LogType.INFO]: "✨",
    [LogType.ERROR]: "❌",
    [LogType.FINAL_ERROR]: "❌",
    [LogType.WARNING]: "🚨",
    [LogType.HINT]: "💡",
    [LogType.DEBUGDATA]: "🐞",
    [LogType.ARROW]: "➡️",
    [LogType.FILE]: "📄",
    [LogType.LINK]: "🔗",
    [LogType.SIGNATURE]: "🔏",
    [LogType.WITNESS]: "👀",
    [LogType.FORM]: "📝",
    [LogType.SCALAR]: "⏺️ ",
    [LogType.TREE]: "🌿",
    [LogType.EMPTY]: "",
};
