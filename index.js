#!/usr/bin/env node

const Web3 = require('web3')
const namehash = require('eth-ens-namehash')
const multihash = require('multihashes')

const abi = require('./abi.js')
const REGISTRAR = "0x314159265dd8dbb310642f98f50c066173c1259b"


class ensIpfsResolver {
  constructor() {
    this.web3 = new Web3(new Web3.providers.HttpProvider("https://mainnet.infura.io/0pzfHdAhsqakqtBk8Hs6"))
  }

  ensToUrl(name) {
    this.ensToIpfsHash(name)
      .then(console.log)
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
      let buf = multihash.fromHexString(hex)
      // Multihash encode and convert to base58
      return multihash.toB58String(multihash.encode(buf, 'sha2-256'))
    } else {
      throw new Error()
    }
  }
}

let resolver = new ensIpfsResolver()
resolver.ensToUrl('raksooo.eth')

