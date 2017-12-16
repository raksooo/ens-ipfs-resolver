#!/usr/bin/env node

const program = require('commander')
const ensIpfsResolver = require('./index')

program
  .option('-e, --eth-rpc-port <n>')
  .option('-i, --ipfs-port <n>')
  .arguments('<domain>')
  .action((domain, options) => {
    let ports = {
      ethPort: options.ethRpcPort,
      ipfsPort: options.ipfsPort
    }
    let resolver = new ensIpfsResolver(ports)
    resolver.init()
      .then(() => resolver.ensToUrl(domain))
      .catch(() => console.error('An error occured'))
  })

program.parse(process.argv)

