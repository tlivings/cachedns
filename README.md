# cachedns

Caching for `dns` functions.

### Usage

```javascript
let Dns = require('cachedns')({ ttl: 300 });

Dns.resolve('google.com', 'A', (error, addresses) => {
    //addresses will now be cached for ttl
})
```
