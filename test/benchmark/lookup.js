'use strict';

const Hammer = require('hammertime');
const Cachedns = require('../../lib');

const dns = Cachedns({ ttl: 300 });
//const dns = require('dns');

Hammer({
    iterations: 5000,
    after: console.log
}).
time((next) => {
    dns.lookup('localhost', (error, addresses) => {
        if (error) {
            throw error;
        }
        next();
    });
});
