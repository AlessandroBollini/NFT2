import React from "react";
import { useMoralis } from "react-moralis";

//Componente importato nell'Header per connettere il proprio Wallet a Metamask

export const ConnectWallet = () => {
    const { authenticate, isAuthenticated } = useMoralis();
    const handleAuthentication = (e) => {
        e.preventDefault();
        authenticate();
    };
    console.log(isAuthenticated);
    return (
        <button className='wallet-btn' type='button' onClick={handleAuthentication}>
            <span className='hide-on-sm'>
                MetaMask Wallet Connect (Not Connected)
            </span>
            <span className='hide-on-md'> Connect Wallet </span>
        </button>
    );
};
