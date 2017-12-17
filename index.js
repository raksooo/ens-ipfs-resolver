const Web3 = require('web3')
const namehash = require('eth-ens-namehash')
const multihash = require('multihashes')
const tcpp = require('tcp-ping')

const abi = require('./abi.js')
const REGISTRAR = '0x314159265dd8dbb310642f98f50c066173c1259b'

module.exports = class ensIpfsResolver {
  constructor({ ethPort, ipfsPort } = {}) {
    this.ethPort = ethPort || 8545
    this.ipfsPort = ipfsPort || 8080
  }

  init() {
    if (this.web3) return;

    return this._checkPort(this.ethPort)
      .then(available => {
        this.gateway = available ? 'http://localhost:' + this.ethPort
          : 'https://mainnet.infura.io/0pzfHdAhsqakqtBk8Hs6'
      })
  }

  set gateway(url) {
    this.web3 = new Web3(new Web3.providers.HttpProvider(url))
  }

  ensToUrl(name) {
    let hash
    return this.ensToIpfsHash(name)
      .then(_hash => hash = _hash)
      .then(this._checkPort.bind(this, this.ipfsPort))
      .then(available => {
        let domain = available ? 'http://localhost:' + this.ipfsPort
          : 'https://ipfs.io'
        return domain + '/ipfs/' + hash
      })
  }

  ensToIpfsHash(name) {
    let hash = namehash.hash(name)
    let registrar = new this.web3.eth.Contract(abi.registrar, REGISTRAR)

    return registrar.methods.resolver(hash).call()
      .then(this._addressToContentHash.bind(this, name, hash))
      .then(this._contentHashToIpfsHash)
      .catch(e => Promise.reject(e.message || e))
  }

  _addressToContentHash(name, hash, address) {
    if (address === '0x0000000000000000000000000000000000000000') {
      return Promise.reject(name + ' is not registered')
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
      return Promise.reject("No content hash for domain")
    }
  }

  _checkPort(port) {
    return new Promise((resolve, reject) => {
      tcpp.probe('localhost', port, (err, available) => resolve(available))
    })
  }
}

