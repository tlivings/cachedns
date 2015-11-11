'use strict';

import Test from 'tape';
import cachedns from '../lib';

Test.only('cachedns', (t) => {

    let dns = cachedns();

    t.test('lookup', (t) => {
        t.plan(7);

        dns.lookup('google.com', (error, addresses, family) => {
            t.ok(!error, 'no error.');
            t.ok(addresses, 'found results.');
            t.ok(family, 'family found.');
            t.ok(dns._cache.search('lookup_google.com'), 'in cache.');

            dns.lookup('google.com', (error, addresses, family) => {
                t.ok(!error, 'no error.');
                t.ok(addresses, 'found results.');
                t.ok(family, 'family found.');
            });
        });
    });

    t.test('options', (t) => {
        t.plan(4);

        dns.lookup('google.com', {family: 4}, (error, addresses, family) => {
            t.ok(!error, 'no error.');
            t.ok(addresses, 'found results.');
            t.ok(family, 'family found.');
            t.ok(dns._cache.search('lookup_google.com_family_4'), 'in cache.');
        });
    });

});
