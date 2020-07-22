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
  await indy.deletePoolLedgerConfig(poolName)
}

async function openWallet (name, key) {
  const walletConfig = { id: name }
  const walletCredentials = { key: key }
  await indy.openWallet(walletConfig, walletCredentials)
}

async function closeWallet (name, key, wallet) {
  const walletConfig = { id: name }
  const walletCredentials = { key: key }
  await indy.closeWallet(wallet)
  await indy.deleteWallet(walletConfig, walletCredentials)
}

async function run () {
  // Start
  console.log('gettingStarted.js -> started')

  // Open ledger, get pool handle
  // const poolName = 'staging'
  // const poolGenesisTxnPath = '/root/genesis/stage_gen_txn_file'
  // console.log(`Open ledger: ${poolName}`)
  // const poolHandle = await openLedger(poolName, poolGenesisTxnPath)

  // // Ledger is open
  // console.log('Ledger is open...')

  // Open Jonny's Dawg Shack wallet
  const walletName = 'jonnys-dawg-shack'
  const walletKey = process.env.JONNYS_DAWG_SHACK
  const walletConfig = { id: walletName }
  const walletCredentials = { key: walletKey }
  const jonnysWallet = await indy.openWallet(walletConfig, walletCredentials).catch(e => {
    console.log(e)
  })
  const [newDid, newVerKey] = await indy.createAndStoreMyDid(jonnysWallet, {}).catch(e => {
    console.log(e)
  })
  console.log(`${newDid}, ${newVerKey}`)
  await indy.closeWallet(jonnysWallet).catch(e => {
    console.log(e)
  })
  // console.log(`Open wallet: ${faberCollegeWalletName}`)
  // const faberCollegeWallet = await openWallet(faberCollegeWalletName, faberCollegeWalletKey)

  // // Faber College wallet is open
  // console.log('Wallet is open...')

  // // Close Faber College wallet
  // console.log(`Close wallet: ${faberCollegeWalletName}`)
  // await closeWallet(faberCollegeWalletName, faberCollegeWalletKey, faberCollegeWallet)

  // Close ledger
  // console.log(`Close ledger: ${poolName}`)
  // await closeLedger(poolName, poolHandle)

  // // Finished
  // console.log('gettingStarted.js -> done')
}

if (require.main.filename === __filename) {
  run()
}

module.exports = {
  run
}
