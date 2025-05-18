/**
 * Token addresses for the SEI Testnet
 * Updated from deployment on April 26, 2024
 */
export const tokenAddresses = {
  // Native SEI token doesn't need an address as it's the native currency
  sei: null,
  // Mock USDC token address from the contract deployment
  usdc: '0xDb8F9c652f613FAdB680daE048642D0e6AC8F733',
  // Principal token address
  principalToken: '0x635f07BaB844533557dB2CC7bf8F515371e884E1',
  // Yield token address
  yieldToken: '0x62D7c9a5462a69aC2e59B96DfdC3572b3f365f3e',
}

/**
 * Token metadata
 */
export const tokenMetadata = {
  sei: {
    name: 'SEI',
    symbol: 'SEI',
    decimals: 18,
  },
  usdc: {
    name: 'USDC',
    symbol: 'USDC',
    decimals: 6,
  },
}
