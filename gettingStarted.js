'use strict'

const indy = require('indy-sdk')
// const util = require('./util')
// const assert = require('assert')

async function run () {
  console.log('gettingStarted.js -> started')

  const poolName = 'staging'
  console.log(`Open ledger: ${poolName}`)
  const poolGenesisTxnPath = '/root/genesis/stage_gen_txn_file'
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

  const poolHandle = await indy.openPoolLedger(poolName)

  console.log('Ledger is open...')

  console.log(`Close ledger: ${poolName}`)
  await indy.closePoolLedger(poolHandle)
  await indy.deletePoolLedgerConfig(poolName)

  console.log('gettingStarted.js -> done')
}

if (require.main.filename === __filename) {
  run()
}

module.exports = {
  run
}
