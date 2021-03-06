'use strict';

const Hammer = require('hammertime');
const Dns = require('dns');

Hammer({
    iterations: 10000,
    after: (result) => {
        console.log('dns');
        console.log(result);
    }
}).
time((next) => {
    Dns.lookup('localhost', (error, addresses) => {
        if (error) {
            throw error;
        }
        next();
    });
});
