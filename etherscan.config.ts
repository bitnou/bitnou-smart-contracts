import type { HardhatUserConfig } from 'hardhat/config'
import { configVariable } from 'hardhat/config'

/**
 * Hardhat 3 verification config.
 *
 * Uses `configVariable` to securely resolve the BscScan API key from
 * the Hardhat keystore or from the BSCSCAN_API_KEY environment variable.
 *
 * Chain descriptors for BSC (56) and BSC Testnet (97) are built into
 * Hardhat 3, so no custom chain definitions are needed.
 */
const verifyConfig = {
  verify: {
    etherscan: {
      apiKey: configVariable('BSCSCAN_API_KEY')
    },
    blockscout: {
      enabled: false
    },
    sourcify: {
      enabled: false
    }
  }
} satisfies Partial<HardhatUserConfig>

export default verifyConfig
