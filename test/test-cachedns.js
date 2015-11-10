'use strict';

import Test from 'tape';
import cachedns from '../lib';

Test.only('cachedns', function (t) {

    let dns = cachedns();

    t.test('lookup', function (t) {
        t.plan(2);

        dns.lookup('google.com', 'A', (error, addresses) => {
            t.ok(!error, 'no error.');
            t.ok(dns._cache.search('google.com'), 'in cache.');
        });
    });

});
