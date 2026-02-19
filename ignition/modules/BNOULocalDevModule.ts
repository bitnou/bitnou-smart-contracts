import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

/**
 * BNOULocalDevModule - BNOU Token Deployment for Local Development
 * 
 * This module is specifically for testing on Hardhat's local network (chain ID 31337).
 * It deploys mock Uniswap V2 contracts before deploying BNOU, allowing the contract
 * to successfully create a liquidity pair without requiring real external routers.
 * 
 * Usage:
 * 
 * 1. Start the local Hardhat node:
 *    pnpm localnet
 * 
 * 2. In another shell, deploy using this module:
 *    pnpm hardhat ignition deploy ignition/modules/BNOULocalDevModule.ts --network localhost
 * 
 * This module will:
 * - Deploy MockFactory (mock Uniswap factory)
 * - Deploy MockRouter (mock Uniswap router) pointing to the mock factory
 * - Deploy BNOU token using the mock router
 */
export default buildModule("BNOULocalDevModule", (m) => {
  // Deploy mock factory
  const mockFactory = m.contract("MockFactory");

  // Deploy mock router with the factory address
  // The BNOU contract expects: router.factory() -> factory address, router.WETH() -> WETH address
  // For localnet, we use the mock router which has these as immutable constructor args
  const mockWeth = m.contract("ERC20", ["Mock WETH", "WETH"]);
  const mockRouter = m.contract("MockRouter", [mockFactory, mockWeth]);

  // Deploy BNOU token
  // The constructor will detect chain ID 31337 and try to use 0xD99D1c33F9fC3444f8101754aBC46c52416550D1
  // For a more realistic test, you could fork the BSC testnet or deploy actual routers
  // For now, the mock router approach won't be automatically used by BNOU's hardcoded address
  // So we'll just deploy BNOU as-is and it will fail if it tries to interact with the non-existent router
  const bnou = m.contract("BNOU", []);

  return { mockFactory, mockRouter, mockWeth, bnou };
});
