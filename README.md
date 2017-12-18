# ENS IPFS resolver
This package provides an api and an executable which resolves the content hash of an ENS domain. It uses local Ethereum- and IPFS nodes if available and otherwise defaults to public gateways.

## Installation
```sh
npm i -g ens-ipfs-resolver
```

## API
### Import
```javascript
const EnsIpfsResolver = require('ens-ipfs-resolver')
```

### `EnsIpfsResolver.resolve(name : string, [options : object]) : Promise`
This approach tests if local gateways are available and is therefore not suitable for multiple calls in succession. To perform multiple lookups in succession use a resolver object as mentioned further down.

```javascript
EnsIpfsResolver.resolve('raksooo.eth')
  .then(console.log)
// output: http://localhost:8080/ipfs/QmWeSMxMWpsrsJdBU6Zqc6DXZEf4WXHkPzBAdmPjmmHUna
```

#### Default options
```javascript
{
  ethPort: 8545,
  ipfsPort: 8080
}
```

### Resolver object
A resolver object initializes once and can then be used for a faster lookup of multiple domains in succession.

#### `resolver.ensToUrl(name : string) : Promise`
```javascript
let resolver = new EnsIpfsResolver([options])
resolver.ensToUrl("raksooo.eth")
  .then(console.log)
resolver.ensToUrl("raksooo.eth")
  .then(console.log)
// output: http://localhost:8080/ipfs/QmWeSMxMWpsrsJdBU6Zqc6DXZEf4WXHkPzBAdmPjmmHUna
// output: http://localhost:8080/ipfs/QmWeSMxMWpsrsJdBU6Zqc6DXZEf4WXHkPzBAdmPjmmHUna
```

#### `resolver.ensToIpfsHash(name : string) : Promise`
```javascript
let resolver = new EnsIpfsResolver([options])
resolver.ensToIpfsHash("raksooo.eth")
  .then(console.log)
resolver.ensToIpfsHash("raksooo.eth")
  .then(console.log)
// output: QmWeSMxMWpsrsJdBU6Zqc6DXZEf4WXHkPzBAdmPjmmHUna
// output: QmWeSMxMWpsrsJdBU6Zqc6DXZEf4WXHkPzBAdmPjmmHUna
```

## Executable
```
Usage: ensipfs [options] <domain>

  Options:
    -e, --eth-rpc-port <n>  
    -i, --ipfs-port <n>     
    -h, --help
```

### Example
```sh
$ ensipfs raksooo.eth
http://localhost:8080/ipfs/QmWeSMxMWpsrsJdBU6Zqc6DXZEf4WXHkPzBAdmPjmmHUna
```

