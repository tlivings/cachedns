'use strict';

const Hammer = require('hammertime');
const Cachedns = require('../../lib');

const dns = Cachedns({ ttl: 300 });

Hammer({
    iterations: 10000,
    after: (result) => {
        console.log('cachedns');
        console.log(result);
    }
}).
time((next) => {
    dns.lookup('localhost', (error, addresses) => {
        if (error) {
            throw error;
        }
        next();
    });
});
