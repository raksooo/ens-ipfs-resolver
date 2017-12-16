#!/usr/bin/env node

const Web3 = require('web3')
const namehash = require('eth-ens-namehash')
const multihash = require('multihashes')
const tcpp = require('tcp-ping')

const abi = require('./abi.js')
const REGISTRAR = '0x314159265dd8dbb310642f98f50c066173c1259b'

class ensIpfsResolver {
  constructor({ ethPort, ipfsPort } = {}) {
    this.ethPort = ethPort || 8545
    this.ipfsPort = ipfsPort || 8080
  }

  init() {
    return new Promise((resolve, reject) => {
      tcpp.probe('localhost', this.ethPort, (err, available) => {
        this.web3 = available ? 'http://localhost:' + this.ethPort
          : 'https://mainnet.infura.io/0pzfHdAhsqakqtBk8Hs6'
        resolve()
      })
    })
  }

  set web3(url) {
    this._web3 = new Web3(new Web3.providers.HttpProvider(url))
  }

  get web3() {
    return this._web3
  }

  ensToUrl(name) {
    this.ensToIpfsHash(name)
      .then(hash => {
        let url = 'http://localhost:' + this.ipfsPort + '/ipfs/' + hash
        console.log(url)
      })
  }

  ensToIpfsHash(name) {
    let hash = namehash.hash(name)
    let registrar = new this.web3.eth.Contract(abi.registrar, REGISTRAR)

    return registrar.methods.resolver(hash).call()
      .then(this._addressToContentHash.bind(this, hash))
      .then(this._contentHashToIpfsHash)
  }

  _addressToContentHash(hash, address) {
    if (address === '0x0000000000000000000000000000000000000000') {
      throw new Error()
    } else {
      let resolver = new this.web3.eth.Contract(abi.resolver, address)
      return resolver.methods.content(hash).call()
    }
  }

  _contentHashToIpfsHash(contentHash) {
    if (contentHash) {
      // Remove 0x prefix
      let hex = contentHash.substring(2)
      // Convert to buffer
      let buffer = multihash.fromHexString(hex)
      // Multihash encode and convert to base58
      return multihash.toB58String(multihash.encode(buffer, 'sha2-256'))
    } else {
      throw new Error()
    }
  }
}

let resolver = new ensIpfsResolver()
resolver.init()
  .then(resolver.ensToUrl.bind(resolver, 'raksooo.eth'))
  .catch(() => console.log('An error occured'))

