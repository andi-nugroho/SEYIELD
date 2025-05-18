import { defineChain } from 'viem'

export const seiTestnet = defineChain({
  id: 1328 ,
  name: 'SEI Testnet',
  network: 'atlantic-2',
  nativeCurrency: {
    decimals: 18,
    name: 'SEI',
    symbol: 'SEI',
  },
  rpcUrls: {
    default: { http: ['https://evm-rpc-testnet.sei-apis.com'] },
  },
  blockExplorers: {
    default: { name: 'SEI Explorer', url: 'https://www.seiscan.app/atlantic-2' },
  },
  testnet: true,
})
