'use strict';

import Test from 'tape';
import cachedns from '../lib';

Test.only('cachedns', function (t) {

    let dns = cachedns();

    t.test('lookup', function (t) {
        t.plan(7);

        dns.lookup('google.com', (error, addresses, family) => {
            t.ok(!error, 'no error.');
            t.ok(addresses, 'found results.');
            t.ok(family, 'family found.');
            t.ok(dns._cache.search('google.com'), 'in cache.');

            dns.lookup('google.com', (error, addresses, family) => {
                t.ok(!error, 'no error.');
                t.ok(addresses, 'found results.');
                t.ok(family, 'family found.');
            });
        });
    });

});
