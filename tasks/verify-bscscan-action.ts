import type { NewTaskActionFunction } from 'hardhat/types/tasks'
import type { HardhatRuntimeEnvironment } from 'hardhat/types/hre'

/**
 * Contract addresses to verify on each network.
 * Update these addresses after deploying new contracts.
 *
 * Example:
 * ```typescript
 * const DEPLOYED_CONTRACTS = {
 *   bscTestnet: {
 *     bnou: '0x...',
 *     bnouSafe: '0x...',
 *     masterChef: '0x...'
 *   },
 *   bsc: {
 *     bnou: '0x...',
 *     bnouSafe: '0x...',
 *     masterChef: '0x...'
 *   }
 * }
 * ```
 */
const DEPLOYED_CONTRACTS: Record<string, Record<string, string>> = {
  bscTestnet: {
    bnou: '0xFBf7B5d91297aC0b0b2D184af0b9F81FE053819a'
    // bnouSafe: '0x...',
    // masterChef: '0x...',
    // bnouPool: '0x...',
    // bnouFlexiblePool: '0x...'
  },
  bsc: {
    bnou: '0x4f47f066d839634bf4e992021a65d209B383EE1e'
    // bnouSafe: '0x...',
    // masterChef: '0x...',
    // bnouPool: '0x...',
    // bnouFlexiblePool: '0x...'
  }
}

/**
 * Fully qualified contract names (source:contract format).
 * Required when multiple contracts share the same bytecode.
 */
const CONTRACT_FQN: Record<string, string> = {
  bnou: 'contracts/BNOU.sol:BNOU',
  // bnouSafe: 'contracts/BNOUSafe.sol:BNOUSafe',
  // masterChef: 'contracts/MasterChef.sol:MasterChef',
  // bnouPool: 'contracts/BNOUPool.sol:BNOUPool',
  // bnouFlexiblePool: 'contracts/BNOUFlexiblePool.sol:BNOUFlexiblePool'
}

/**
 * Constructor arguments for each contract.
 * BNOU has no constructor arguments.
 * Update as needed for other contracts.
 */
const CONSTRUCTOR_ARGS: Record<string, Record<string, unknown[]>> = {
  bscTestnet: {
    bnou: []
    // bnouSafe: [...],
    // masterChef: [...],
    // bnouPool: [...],
    // bnouFlexiblePool: [...]
  },
  bsc: {
    bnou: []
    // bnouSafe: [...],
    // masterChef: [...],
    // bnouPool: [...],
    // bnouFlexiblePool: [...]
  }
}

/**
 * Verify a single contract on BscScan.
 * Uses Hardhat 3 task API: hre.tasks.getTask() to invoke the verify task.
 */
async function verifyContract(
  hre: HardhatRuntimeEnvironment,
  contractName: string,
  address: string,
  constructorArgs: unknown[] = [],
  contractFqn?: string
): Promise<void> {
  console.log(`\n📋 Verifying ${contractName} at ${address}...`)

  try {
    // Hardhat 3: get the root "verify" task and run it with positional args
    // The verify task sets process.exitCode on failure instead of throwing
    const previousExitCode = process.exitCode
    process.exitCode = 0

    const verifyTask = hre.tasks.getTask('verify')
    await verifyTask.run({
      address,
      constructorArgs,
      ...(contractFqn ? { contract: contractFqn } : {})
    })

    // Restore previous exit code — the verify task uses process.exitCode
    // to signal results, but "already verified" also sets it to non-zero
    process.exitCode = previousExitCode
    console.log(`✅ ${contractName} verified successfully!`)
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    if (errorMessage.includes('Already Verified') || errorMessage.includes('already verified')) {
      console.log(`⚠️  ${contractName} is already verified on BscScan`)
    } else {
      console.error(`❌ ${contractName} verification failed:`, errorMessage)
    }
  }
}

/**
 * Task action: Verify all BNOU contracts on BscScan.
 *
 * Iterates through configured contracts for the active network
 * and submits each one for verification via the hardhat-verify plugin.
 */
const verifyBscscanAction: NewTaskActionFunction = async (_taskArgs, hre) => {
  // Hardhat 3: connect to network to get the resolved network name
  const connection = await hre.network.connect()
  const networkName = connection.networkName

  console.log(`\n🔍 Starting BscScan verification on ${networkName}...`)
  console.log('═'.repeat(60))

  // Get contracts for the current network
  const contracts = DEPLOYED_CONTRACTS[networkName]
  const constructorArgs = CONSTRUCTOR_ARGS[networkName]

  if (!contracts) {
    console.error(`\n❌ No contracts configured for network: ${networkName}`)
    console.log(
      '\n📝 To add contracts for verification, update DEPLOYED_CONTRACTS and CONSTRUCTOR_ARGS in tasks/verify-bscscan-action.ts'
    )
    process.exit(1)
  }

  // Verify each contract
  let verifiedCount = 0
  const totalCount = Object.keys(contracts).length

  for (const [contractName, contractAddress] of Object.entries(contracts)) {
    const args = (constructorArgs && constructorArgs[contractName]) || []
    const fqn = CONTRACT_FQN[contractName]
    await verifyContract(hre, contractName, contractAddress, args, fqn)
    verifiedCount++
  }

  console.log('\n' + '═'.repeat(60))
  console.log(
    `✨ Verification complete! (${verifiedCount}/${totalCount} contracts)`
  )

  // Display block explorer link
  const blockExplorerUrl =
    networkName === 'bsc'
      ? 'https://bscscan.com/'
      : 'https://testnet.bscscan.com/'

  console.log(
    `\n📊 View verified contracts on BscScan:\n  ${blockExplorerUrl}`
  )
}

export default verifyBscscanAction
