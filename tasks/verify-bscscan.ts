import type { HardhatPlugin } from 'hardhat/types/plugins'

import { task } from 'hardhat/config'

/**
 * Hardhat 3 Plugin: Verify Contracts on BscScan
 *
 * Registers a custom task to verify all configured BNOU contracts on BscScan.
 * Handles BSC Mainnet and Testnet. Gracefully skips already-verified contracts.
 *
 * Usage:
 *   pnpm hardhat verify-bscscan --network bscTestnet
 *   pnpm hardhat verify-bscscan --network bsc
 *
 * @see https://hardhat.org/docs/guides/smart-contract-verification
 */
const verifyBscscanPlugin: HardhatPlugin = {
  id: 'verify-bscscan',
  tasks: [
    task('verify-bscscan', 'Verify all BNOU contracts on BscScan')
      .setAction(() => import('./verify-bscscan-action.js'))
      .build()
  ]
}

export default verifyBscscanPlugin
