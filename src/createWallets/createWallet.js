import {ethers} from "ethers";


export default function createWallet(){
    const n=4;
    const provider=new ethers.providers.EtherscanProvider("rinkeby");
    const wallets=[];
    for(let i=0;i<n;i++){
        const emptyWallet=ethers.Wallet.createRandom();
        const connectedWallet=emptyWallet.connect(provider);
        wallets.push(connectedWallet);
    }
    return wallets;
}