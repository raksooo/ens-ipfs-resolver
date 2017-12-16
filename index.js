#!/usr/bin/env node

const Web3 = require('web3')
const namehash = require('eth-ens-namehash')
const multihash = require('multihashes')

const abi = require('./abi.js')
const REGISTRAR = "0x314159265dd8dbb310642f98f50c066173c1259b"

const web3 = new Web3(new Web3.providers.HttpProvider("https://mainnet.infura.io/0pzfHdAhsqakqtBk8Hs6"))

function ensToUrl(name) {

}

function ensToIpfsHash(name) {
  let hash = namehash.hash(name)
  registrar = new web3.eth.Contract(abi.registrar, REGISTRAR)

  return registrar.methods.resolver(hash).call()
    .then(_addressToContentHash.bind(this, hash))
    .then(_contentHashToIpfsHash)
}

function _addressToContentHash(hash, address) {
  if (address === '0x0000000000000000000000000000000000000000') {
    throw new Error()
  } else {
    resolver = new web3.eth.Contract(abi.resolver, address)
    return resolver.methods.content(hash).call()
  }
}

function _contentHashToIpfsHash(contentHash) {
  if (contentHash) {
    // Remove 0x prefix
    hex = contentHash.substring(2)
    // Convert to buffer
    buf = multihash.fromHexString(hex)
    // Multihash encode and convert to base58
    return multihash.toB58String(multihash.encode(buf, 'sha2-256'))
  } else {
    throw new Error()
  }
}

ensToIpfsHash('raksooo.eth')
  .then(console.log)

