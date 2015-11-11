'use strict';

import Test from 'tape';
import Cachedns from '../lib';

Test.only('cachedns', (t) => {

    let dns = Cachedns();

    t.test('lookup', (t) => {
        t.plan(7);

        dns.lookup('google.com', (error, addresses, family) => {
            t.ok(!error, 'no error.');
            t.ok(addresses, 'found results.');
            t.ok(family, 'family found.');
            t.ok(dns._cache['lookup_google.com'], 'in cache.');

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
            t.ok(dns._cache['lookup_google.com_family_4'], 'in cache.');
        });
    });

    t.test('resolve', (t) => {
        t.plan(3);

        dns.resolve('google.com', 'A', (error, addresses) => {
            t.ok(!error, 'no error.');
            t.ok(addresses, 'found results.');
            t.ok(dns._cache['resolve_google.com_A'], 'in cache.');
        });
    });

    t.test('error', (t) => {
        t.plan(1);

        dns.lookup('!!!', (error, addresses) => {
            t.ok(error, 'error.');
        });
    });

});
