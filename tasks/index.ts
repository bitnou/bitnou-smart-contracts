/**
 * Hardhat Custom Tasks (Plugins)
 *
 * In Hardhat 3, tasks are registered via plugins with a `tasks` array.
 * Each plugin exports a HardhatPlugin object that is added to the config's
 * `plugins` array in hardhat.config.ts.
 *
 * @see https://hardhat.org/docs/advanced/create-task
 */

export { default as verifyBscscanPlugin } from './verify-bscscan.js'
