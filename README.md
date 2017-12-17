# ENS IPFS resolver
This package provides an api and an executable which resolves the content hash of an ENS domain. It uses local Ethereum- and IPFS nodes if available and otherwise defaults to public gateways.

## Installation
```sh
npm i -g ens-ipfs-resolver
```

## API
To import and create a resolver object:
```javascript
const ensIpfsResolver = require('ens-ipfs-resolver')
let resolver = new ensIpfsResolver([options])
```

The default options are:
```javascript
{
  ethPort: 8545,
  ipfsPort: 8080
}
```

### `resolver.ensToUrl(name : string) : Promise`
```javascript
resolver.ensToUrl("raksooo.eth")
  .then(console.log)
// output: http://localhost:8080/ipfs/QmWeSMxMWpsrsJdBU6Zqc6DXZEf4WXHkPzBAdmPjmmHUna
```

### `resolver.ensToIpfsHash(name : string) : Promise`
```javascript
resolver.ensToIpfsHash("raksooo.eth")
  .then(console.log)
// output: QmWeSMxMWpsrsJdBU6Zqc6DXZEf4WXHkPzBAdmPjmmHUna
```

## Binary
```
Usage: ensipfs [options] <domain>

  Options:
    -e, --eth-rpc-port <n>  
    -i, --ipfs-port <n>     
    -h, --help              output usage information
```

### Example
```sh
$ ensipfs raksooo.eth
http://localhost:8080/ipfs/QmWeSMxMWpsrsJdBU6Zqc6DXZEf4WXHkPzBAdmPjmmHUna
```

