'use strict'

const indy = require('indy-sdk')
// const assert = require('assert')

async function openLedger (poolName, poolGenesisTxnPath) {
  const poolConfig = {
    genesis_txn: poolGenesisTxnPath
  }
  try {
    await indy.createPoolLedgerConfig(poolName, poolConfig)
  } catch (e) {
    if (e.message !== 'PoolLedgerConfigAlreadyExistsError') {
      throw e
    }
  }
  await indy.setProtocolVersion(2)

  return await indy.openPoolLedger(poolName)
}

async function closeLedger (poolName, poolHandle) {
  await indy.closePoolLedger(poolHandle)
}

async function openWallet (name, key) {
  const walletConfig = { id: name }
  const walletCredentials = { key: key }
  return await indy.openWallet(walletConfig, walletCredentials).catch(e => {
    console.log(e)
  })
}

async function closeWallet (name) {
  await indy.closeWallet(name).catch(e => {
    console.log(e)
  })
}

async function writeNewDid (handle) {
  // Create and store the new DID
  const [did, verkey] = await indy.createAndStoreMyDid(handle, {}).catch(e => {
    console.log(e)
  })
  // Write metadata
  await indy.setDidMetadata(handle, did, 'From getting started').catch(e => {
    console.log(e)
  })
  return [did, verkey]
}

async function run () {
  // Start
  console.log('gettingStarted.js -> started')

  // Open ledger, get pool handle
  const poolName = 'staging'
  const poolGenesisTxnPath = '/root/genesis/stage_gen_txn_file'
  console.log(`Open ledger: ${poolName}`)
  const poolHandle = await openLedger(poolName, poolGenesisTxnPath)

  // Ledger is open
  console.log('Ledger is open...')

  // Open Jonny's Dawg Shack wallet
  const walletName = 'jonnys-dawg-shack'
  const walletKey = process.env.JONNYS_DAWG_SHACK
  console.log(`Open wallet: ${walletName}`)
  const jonnysWallet = await openWallet(walletName, walletKey).catch(e => {
    console.log(e)
  })

  // Write new did/verkey pair to Jonny's Dawg Shack wallet
  console.log(`Writing new DID/Verkey pair to ${walletName}...`)
  const [newDid, newVerKey] = await writeNewDid(jonnysWallet).catch(e => {
    console.log(e)
  })
  console.log(`Done!
  ${newDid}:${newVerKey}`)

  // Close Wallet
  console.log(`Close wallet: ${walletName}`)
  await closeWallet(jonnysWallet).catch(e => {
    console.log(e)
  })

  // Close ledger
  console.log(`Close ledger: ${poolName}`)
  await closeLedger(poolName, poolHandle)

  // Finished
  console.log('gettingStarted.js -> done')
}

if (require.main.filename === __filename) {
  run()
}

module.exports = {
  run
}
