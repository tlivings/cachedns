'use strict';

import Hammer from 'hammertime';
import Cachdns from '../../lib';
//import Dns from 'dns';

let dns = Cachdns({ ttl: 300 });

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
