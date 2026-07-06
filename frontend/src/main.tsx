import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

import { PrivyProvider } from '@privy-io/react-auth';

const botChainTestnet = {
  id: 968,
  network: 'BOT Chain Testnet',
  name: 'BOT Chain Testnet',
  nativeCurrency: {
    name: 'BOT',
    symbol: 'BOT',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.bohr.life'],
    },
    public: {
      http: ['https://rpc.bohr.life'],
    },
  },
  blockExplorers: {
    default: { name: 'BohrScan', url: 'https://scan.bohr.life' },
  },
};

const PRIVY_APP_ID = import.meta.env.VITE_PRIVY_APP_ID || "cmr7ondjm00gm0cldcztrhas4";

const sepolia = {
  id: 11155111,
  network: 'sepolia',
  name: 'Sepolia',
  nativeCurrency: { name: 'Sepolia Ether', symbol: 'SEP', decimals: 18 },
  rpcUrls: { default: { http: ['https://rpc.sepolia.org'] }, public: { http: ['https://rpc.sepolia.org'] } },
  blockExplorers: { default: { name: 'Etherscan', url: 'https://sepolia.etherscan.io' } },
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PrivyProvider
      appId={PRIVY_APP_ID}
      config={{
        loginMethods: ['twitter', 'wallet'],
        appearance: {
          theme: 'dark',
          accentColor: '#c3f400',
          logo: 'https://lh3.googleusercontent.com/aida/AP1WRLslTVqNUM9YdFCh5GZDand7NE6-D-0phqhpFpb5uythQwusOio87zmc_zoTv1LZJfc17FdSyM4-tH4ljcBPXwHuY8NnIvxoQxUN-IDeHO3o7-sw9xpTZG5I1lh8aU20d7Ym_Qfwgo6b7heUjBqTDRY1w-yzlXq-ZXe_u-9LlY1-Bv6xMyfIW3zR-CKfai4Zyf7Afgi4r3P92heRqDS7d02JE3lUFNvzGJRqo45Ya7bvJgI6_flsMmVBrWM',
        },
        defaultChain: botChainTestnet as any,
        supportedChains: [botChainTestnet as any, sepolia as any],
        embeddedWallets: {
          createOnLogin: 'off',
        } as any
      }}
    >
      <App />
    </PrivyProvider>
  </StrictMode>,
)
