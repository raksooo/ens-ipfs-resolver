#!/usr/bin/env node

const program = require('commander')
const EnsIpfsResolver = require('./index')

program
  .option('-e, --eth-rpc-port <n>')
  .option('-i, --ipfs-port <n>')
  .arguments('<domain>')
  .action((domain, options) => {
    let ports = {
      ethPort: options.ethRpcPort,
      ipfsPort: options.ipfsPort
    }
    EnsIpfsResolver.resolve(domain)
      .then(console.log)
      .catch(e => console.error('An error occured:', e))
  })

program.parse(process.argv)


