import { ethers, network } from "hardhat";

/**
 * Local development deployment script for BNOU
 * 
 * This script sets up a complete testing environment on Hardhat's local network:
 * 1. Deploys a WETH mock token
 * 2. Deploys a MockFactory (mock Uniswap factory)
 * 3. Deploys a MockRouter (mock Uniswap router)
 * 4. Uses ethers to deploy BNOU
 * 
 * Since BNOU has a hardcoded router address that won't exist on local Hardhat,
 * this script focuses on deploying the token itself for testing purposes.
 * 
 * Usage:
 *   pnpm hardhat run scripts/deployLocalBNOU.ts --network localhost
 */
async function main() {
  console.log("🚀 Starting BNOU deployment on local Hardhat network...");
  console.log(`📍 Network: ${network.name} (Chain ID: ${network.config.chainId})`);

  const [deployer] = await ethers.getSigners();
  console.log(`💳 Deploying with account: ${deployer.address}`);
  console.log(`💰 Account balance: ${ethers.formatEther(await ethers.provider.getBalance(deployer.address))} ETH\n`);

  // 1. Deploy ERC20 Mock (WETH)
  console.log("📦 Deploying Mock WETH...");
  const MockERC20 = await ethers.getContractFactory("ERC20");
  const mockWETH = await MockERC20.deploy("Mock WETH", "WETH");
  await mockWETH.waitForDeployment();
  console.log(`✅ Mock WETH deployed at: ${await mockWETH.getAddress()}\n`);

  // 2. Deploy MockFactory
  console.log("📦 Deploying MockFactory...");
  const MockFactory = await ethers.getContractFactory("MockFactory");
  const mockFactory = await MockFactory.deploy();
  await mockFactory.waitForDeployment();
  console.log(`✅ MockFactory deployed at: ${await mockFactory.getAddress()}\n`);

  // 3. Deploy MockRouter
  console.log("📦 Deploying MockRouter...");
  const MockRouter = await ethers.getContractFactory("MockRouter");
  const mockRouter = await MockRouter.deploy(await mockFactory.getAddress(), await mockWETH.getAddress());
  await mockRouter.waitForDeployment();
  console.log(`✅ MockRouter deployed at: ${await mockRouter.getAddress()}\n`);

  // 4. Deploy BNOU
  // Note: BNOU will try to use the hardcoded router address for chain ID 31337.
  // Since the real router doesn't exist on Hardhat, the constructor will fail during pair creation.
  // For testing token functionality without DEX interactions, you can modify BNOU or deploy it differently.
  console.log("📦 Deploying BNOU Token...");
  try {
    const BNOU = await ethers.getContractFactory("BNOU");
    const bnou = await BNOU.deploy();
    await bnou.waitForDeployment();
    console.log(`✅ BNOU deployed at: ${await bnou.getAddress()}\n`);

    // Display token info
    const name = await bnou.name();
    const symbol = await bnou.symbol();
    const totalSupply = await bnou.totalSupply();
    console.log(`📊 Token Info:`);
    console.log(`   Name: ${name}`);
    console.log(`   Symbol: ${symbol}`);
    console.log(`   Total Supply: ${ethers.formatEther(totalSupply)} tokens\n`);

    console.log("🎉 Deployment successful!");
    console.log(`\n📝 Deployment Summary:`);
    console.log(`   Mock WETH:  ${await mockWETH.getAddress()}`);
    console.log(`   Factory:    ${await mockFactory.getAddress()}`);
    console.log(`   Router:     ${await mockRouter.getAddress()}`);
    console.log(`   BNOU Token: ${await bnou.getAddress()}`);

  } catch (error: unknown) {
    console.error(`\n❌ Error deploying BNOU:`);
    if (error instanceof Error) {
      console.error(error.message);
      if (error.message.includes("router") || error.message.includes("pair")) {
        console.error(`\n⚠️  The BNOU contract references a hardcoded router address that doesn't exist on Hardhat.`);
        console.error(`    For local testing, you'll need to:`);
        console.error(`    1. Use a forked BSC testnet (--network hardhat --fork-url <RPC>)`);
        console.error(`    2. Or modify BNOU to delay/skip pair creation in the constructor`);
        console.error(`    3. Or use the mock router approach with setCode to inject at the expected address`);
      }
    }
    throw error;
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
