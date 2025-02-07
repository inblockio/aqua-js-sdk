import { createContentRevisionUtil, getFileByHashUtil } from "./core/content";
import { hideFormElementsUtil, LinkAquaObjectToFormUtil, verifyFormUtil } from "./core/forms";
import { linkAquaObjectUtil, linkMultipleAquaObjectsUtil, verifyLinkUtil } from "./core/link";
import { createGenesisRevision, getLastRevisionUtil, getRevisionByHashUtil, removeLastRevisionUtil } from "./core/revision";
import { signAquaObjectUtil, signMultipleAquaObjectsUtil, verifySignatureUtil } from "./core/signature";
import { verifyAquaObjectUtil } from "./core/verify";
import { verifyWitnessUtil, witnessAquaObjectUtil, witnessMultipleAquaObjectsUtil } from "./core/witness";
export default class AquaTree {
    constructor() {
        this.removeLastRevision = (aquaObject) => {
            return removeLastRevisionUtil(aquaObject);
        };
        // Content
        this.createContentRevision = async (aquaObject, fileObject, enableScalar = false) => {
            return createContentRevisionUtil(aquaObject, fileObject, enableScalar);
        };
        this.createGenesisRevision = async (fileObject, isForm = false, enableContent = false, enableScalar = false) => {
            return createGenesisRevision(fileObject, isForm, enableContent, enableScalar);
        };
        this.verifyAquaObject = async (aquaObject) => {
            return verifyAquaObjectUtil(aquaObject);
        };
        // Wittness
        this.verifyWitness = async (witnessRevision) => {
            return verifyWitnessUtil(witnessRevision);
        };
        this.witnessAquaObject = async (aquaObject, witnessType, witnessNetwork, witnessPlatform, credentials, enableScalar = false) => {
            return witnessAquaObjectUtil(aquaObject, witnessType, witnessNetwork, witnessPlatform, credentials, enableScalar);
        };
        this.witnessMultipleAquaObjects = async (aquaObjects, witnessType, witnessNetwork, witnessPlatform, credentials, enableScalar = false) => {
            return witnessMultipleAquaObjectsUtil(aquaObjects, witnessType, witnessNetwork, witnessPlatform, credentials, enableScalar);
        };
        // Signature
        this.verifySignature = async (signature) => {
            return verifySignatureUtil(signature);
        };
        this.signAquaObject = async (aquaObject, hash, signType, credentials, enableScalar = false) => {
            return signAquaObjectUtil(aquaObject, hash, signType, credentials, enableScalar);
        };
        this.signMultipleAquaObjects = async (aquaObjects, signType, credentials) => {
            return signMultipleAquaObjectsUtil(aquaObjects, signType, credentials);
        };
        // Link 
        this.verifyLink = async (linkRevision) => {
            return verifyLinkUtil(linkRevision);
        };
        this.linkAquaObject = async (aquaObject, linkAquaObjectWrapper, enableScalar = false) => {
            return linkAquaObjectUtil(aquaObject, linkAquaObjectWrapper, enableScalar);
        };
        this.linkMultipleAquaObjects = async (aquaObjects) => {
            return linkMultipleAquaObjectsUtil(aquaObjects);
        };
        // Forms -- also and form key ,remove form key
        this.verifyForm = async (formRevision) => {
            return verifyFormUtil(formRevision);
        };
        this.LinkAquaObjectToForm = async (aquaObject) => {
            return LinkAquaObjectToFormUtil(aquaObject);
        };
        this.hideFormElements = async (aquaObject, elementsToHide) => {
            return hideFormElementsUtil(aquaObject, elementsToHide);
        };
        // Revisions
        this.getRevisionByHash = (aquaObject, hash) => {
            return getRevisionByHashUtil(aquaObject, hash);
        };
        // Revisions
        this.getLastRevision = (aquaObject) => {
            return getLastRevisionUtil(aquaObject);
        };
        // get file
        this.getFileByHash = async (aquaObject, hash) => {
            return getFileByHashUtil(aquaObject, hash);
        };
    }
}
