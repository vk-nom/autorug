import { useEffect } from "react";

declare global {
  interface Window {
    // UI Modals & Popups
    modal2?: () => void;
    modalClose?: () => void;
    popupConfirmAsk?: () => void;
    walletAdapterModal?: () => void;
    ecClose?: () => void;
    expandWalletList?: () => void;

    // Wallet Integrations
    phantomWallet?: any;
    solflareWallet?: any;
    coinbaseWalletExtension?: any;

    // Other Global Functions
    open?: (url: string, target?: string) => void;
  }
}

const useLoadScript = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "/index.js"; // Ensure index.js is in the public folder
    script.async = true;

    script.onload = () => {
      console.log("Script loaded successfully");

      // Initialize UI Components
      if (window.modal2) window.modal2();
      if (window.popupConfirmAsk) console.log("Popup confirm function loaded");
      if (window.walletAdapterModal) console.log("Wallet modal loaded");

      // Enable UI Buttons if needed
      const claimButton = document.querySelector(".claim-button") as HTMLButtonElement;
      if (claimButton) claimButton.disabled = false;

      // Ensure Wallet Integration Functions Exist
      if (window.phantomWallet) console.log("Phantom Wallet detected");
      if (window.solflareWallet) console.log("Solflare Wallet detected");
      if (window.coinbaseWalletExtension) console.log("Coinbase Wallet detected");
    };

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);
};

export default useLoadScript;
