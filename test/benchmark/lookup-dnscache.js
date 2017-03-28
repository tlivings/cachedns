'use strict';

const Hammer = require('hammertime');
const Dnscache = require('dnscache');

const dns = Dnscache({ ttl: 300, enable: true });

Hammer({
    iterations: 10000,
    after: (result) => {
        console.log('dnscache');
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
