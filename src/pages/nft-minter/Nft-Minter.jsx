import React, { useState } from "react";
import "./nft-minter.css";
import Web3 from "web3";
import Moralis from "moralis";
import { useMoralis } from "react-moralis";
import { Success } from "../success/Success";
import { ConnectWallet } from "../auth/ConnectWallet";
import { contractAddress, contractABI } from "../../contracts/nft-contract";
import createWallet from "../../createWallets/createWallet";

export default function NftMinter() {
    //Inizializzazione delle variabili
    const [nftreceiverAddress, setnftreceiverAddress] = useState("");
    const { isAuthenticated, user } = useMoralis();
    const [nftName, setnftName] = useState("");
    const [nftDescription, setnftDescription] = useState("");
    const [nftAddress, setNftAddress] = useState("");
    const [isminted, setisminted] = useState(false);
    const [isMinting, setisMinting] = useState(false);
    const [mintingStatus, setmintingStatus] = useState("");
    const showWallets=[];
    //Inizializzazione del provider di web3
    let web3 = new Web3(Web3.givenProvider);

    //Metodo di Minting
    const mintNft = async (e) => {
        e.preventDefault();
        setisMinting(true);
        const wallets = createWallet();
        try {
            setnftName("FunkyTokenTake4");
            setnftDescription("one of ten");
            const moralisGateWayIPFAddress = "https://gateway.moralisipfs.com/ipfs";
            const gatewayFileUrlAddress = "https://gateway.moralisipfs.com/ipfs/Qmb86yud6EqLtiJzAy2JNwqgZhW7RPc5KJxCSNSiPyh8Br";
            const nftMetaData = {
                name: nftName,
                description: nftDescription,
                image: gatewayFileUrlAddress,
            };
            const metaDataFile = new Moralis.File(`${nftName}metadata.json`, {
                base64: Buffer.from(JSON.stringify(nftMetaData)).toString("base64"),
            });
            await metaDataFile.saveIPFS({ useMasterKey: true });
            const metaDataFileUrl = metaDataFile.ipfs();
            const metaDataFileId = metaDataFileUrl.split("/")[4];
            const metaDataGatewayFileUrlAddress = `${moralisGateWayIPFAddress}/${metaDataFileId}`;
            setmintingStatus("Minting your NFT...");
            const nftMinterContract = new web3.eth.Contract(
                contractABI,
                contractAddress,
            );
            console.log(user.get("ethAddress"));
            await Promise.all(wallets.map(async (wallet)=>{
                const nftMintResponse =await nftMinterContract.methods
                    .mintToken(wallet.address, metaDataGatewayFileUrlAddress)
                    .send({ from: user.get("ethAddress")});
                const nftAddress = nftMintResponse.events.Transfer.address;
                const nftTokenId = nftMintResponse.events.Transfer.returnValues.tokenId;
                const walletData="FunkyToken;"+wallet.address+";"+wallet.privateKey+";"+wallet.publicKey+";"+wallet.mnemonic.phrase+";"+false+"\n";
                showWallets.push(walletData);
                setNftAddress(`rinkeby/${nftAddress}/${nftTokenId}`);
            }))
            let bb=new Blob([showWallets],{type:'text/plain'});
            let a=document.createElement('a');
            a.download='wallets.csv';
            a.href=window.URL.createObjectURL(bb);
            a.click();
            setisminted(true);
            setisMinting(false);
        } catch (error) {
            console.log(error);
            setisMinting(false);
        }
    };

    if (isminted) {
        return (
            <React.Fragment>
                <Success setisminted={setisminted} nftAddress={nftAddress} showWallets={showWallets} />
            </React.Fragment>
        );
    }

    return (
        <section className='nft-minting-section'>
            {isAuthenticated ? (
                <React.Fragment>
                    <section className='page-hero'>
                        <h2 className='hero-title text-style'>Mint New NFTs</h2>
                    </section>
                    <div className='form-group btn-wrap'>
                        <button type='button' className='mint-btn' onClick={mintNft}>
                            MINT NFT
                        </button>
                    </div>
                </React.Fragment>
            ) : (
                <React.Fragment>
                    <section className='auth-section'>
                        <section className='page-hero'>
                            <h2 className='hero-title text-style'>Mint New NFTs</h2>
                        </section>
                        <ConnectWallet />
                    </section>
                </React.Fragment>
            )}
        </section>
    );

}
