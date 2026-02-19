/**
 * Guide: Verifying Contracts on BscScan
 *
 * The custom Hardhat task for BscScan verification is located in: tasks/verify-bscscan.ts
 *
 * QUICK START
 * ===========
 *
 * 1. Verify all configured contracts on testnet:
 *    $ pnpm hardhat verify-bscscan --network bscTestnet
 *
 * 2. Verify all configured contracts on mainnet:
 *    $ pnpm hardhat verify-bscscan --network bsc
 *
 * ADDING NEW CONTRACTS FOR VERIFICATION
 * ======================================
 *
 * To add a new contract for verification, update the DEPLOYED_CONTRACTS and
 * CONSTRUCTOR_ARGS objects in tasks/verify-bscscan.ts:
 *
 * Example: Adding BNOUSafe contract
 *
 *   const DEPLOYED_CONTRACTS = {
 *     bscTestnet: {
 *       bnou: '0xFBf7B5d91297aC0b0b2D184af0b9F81FE053819a',
 *       bnouSafe: '0xYourTestnetAddress'  // <-- Add here
 *     },
 *     bsc: {
 *       bnou: '0x4f47f066d839634bf4e992021a65d209B383EE1e',
 *       bnouSafe: '0xYourMainnetAddress'  // <-- Add here
 *     }
 *   }
 *
 *   const CONSTRUCTOR_ARGS = {
 *     bscTestnet: {
 *       bnou: [],
 *       bnouSafe: [arg1, arg2, ...]  // <-- Add constructor args here
 *     },
 *     bsc: {
 *       bnou: [],
 *       bnouSafe: [arg1, arg2, ...]  // <-- Add constructor args here
 *     }
 *   }
 *
 * Then run: pnpm hardhat verify-bscscan --network bscTestnet
 *
 * MANUAL VERIFICATION (Advanced)
 * ===============================
 *
 * For individual contracts with specific constructor arguments:
 *
 *   pnpm hardhat verify --network bscTestnet 0xContractAddress arg1 arg2
 *
 * TROUBLESHOOTING
 * ===============
 *
 * Issue: "Already Verified"
 * Solution: The contract is already verified on BscScan. This is normal.
 *
 * Issue: "Bytecode mismatch"
 * Solution: Ensure the contract was compiled with the same Solidity version
 *           and optimizer settings as in hardhat.config.ts
 *
 * Issue: "Invalid API key"
 * Solution: Verify BSCSCAN_API_KEY is set correctly in .env
 *
 * DOCUMENTATION
 * ==============
 *
 * @see https://hardhat.org/docs/guides/smart-contract-verification
 * @see https://bscscan.com/apis#contracts
 * @see tasks/verify-bscscan.ts (implementation)
 */

export {}
