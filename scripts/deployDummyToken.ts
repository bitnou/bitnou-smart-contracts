/**
 * deployDummyToken.ts
 * 
 * Deploy a mock BEP20 token for testing purposes (local development only).
 * 
 * This is useful for testing liquidity pair creation and token interactions
 * without needing real tokens from external DEX.
 * 
 * Usage:
 *   pnpm hardhat run scripts/deployDummyToken.ts --network localhost
 * 
 * Prerequisites:
 *   - Run "pnpm localnet" in another terminal first
 */

import hre from 'hardhat'
import { parseUnits } from 'viem'

async function main() {
  console.log('🚀 Deploying MockBEP20 (Dummy Token)...\n')

  const connection = await hre.network.connect()
  const { viem } = connection as { viem: typeof connection.viem }

  const [deployer] = await viem.getWalletClients()

  console.log(`📍 Network: ${hre.network.name}`)
  console.log(`💳 Deployer: ${deployer.account.address}\n`)

  // Deploy MockBEP20 with initial supply
  const initialSupply = parseUnits('1000000', 18) // 1M tokens
  
  console.log('📦 Deploying MockBEP20...')
  const dummy = await viem.deployContract('MockBEP20', [
    'DummyToken',
    'DUMMY',
    initialSupply,
    deployer.account.address
  ])

  console.log(`✅ MockBEP20 deployed at: ${dummy.address}\n`)
  console.log('📊 Token Details:')
  console.log(`   Name: DummyToken`)
  console.log(`   Symbol: DUMMY`)
  console.log(`   Initial Supply: 1,000,000 tokens`)
  console.log(`   Decimals: 18\n`)

  console.log('✨ Ready for testing!\n')
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})

