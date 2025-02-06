import { HDNodeWallet, Wallet } from "ethers"




export class CLISigner {

    public async  doSign  (wallet : HDNodeWallet, verificationHash: string)  {
    const message = "I sign this revision: [" + verificationHash + "]"
    const signature = await wallet.signMessage(message)
    return signature
  }

}
  