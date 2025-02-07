export class CLISigner {
    async doSign(wallet, verificationHash) {
        const message = "I sign this revision: [" + verificationHash + "]";
        const signature = await wallet.signMessage(message);
        return signature;
    }
}
