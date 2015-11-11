# cachedns

Caching for `dns` functions.

### Usage

```javascript
let dns = require('cachedns')({ ttl: 300 });

dns.resolve('google.com', 'A', (error, addresses) => {
    //addresses will now be cached for ttl
});
```
