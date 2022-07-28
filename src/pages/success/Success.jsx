import React from "react";
import "./success-page.css";

//Pagina di conferma se il minting è andato a buon fine

export const Success = ({ setisminted, nftAddress}) => {
    return (
    <section className='minted-nft-section'>
      <div className='minted-address-wrap'>
        <div className='minted-address'>
          <div className='success-message-wrap'>
            <h3 className='text-style'>
              <span>NFT Minted Successfully!</span>
            </h3>
            <p className='success-message'>
              <span>
                Your NFT has been minted and is available for sale on the NFT
                Market.
              </span>
            </p>
            <p className='success-message'>
              <span>
                You can view the last NFT minted on the NFT Market by clicking the button
                below.
              </span>
            </p>
          </div>
          <h3 className='text-style'>
            Minted NFT Address:
            <span className='minted-address-text'> {nftAddress} </span>
          </h3>
        </div>
        <div className='btn-wrap'>
          <a
            href={`https://testnets.opensea.io/assets/${nftAddress}`}
            target='_blank'
            rel='noopener noreferrer'
          >
            <button className='view-btn'>
              <span>View NFT on OpenSea</span>
            </button>
          </a>
        </div>
        <div className='new-mint-wrap'>
          <button
            className='new-mint-btn'
            onClick={() => {
              setisminted(false);
            }}
          >
            Mint New NFT
          </button>
        </div>
      </div>
    </section>
  );
};