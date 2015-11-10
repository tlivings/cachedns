'use strict';

import Test from 'tape';
import Trie from '../dist/lib/trie';

Test('trie', function (t) {

    let trie = Trie();

    t.test('insert/search', function (t) {
        t.plan(2);

        trie.insert('/test/resource.txt', 'data');

        let result = trie.search('/test/resource.txt');

        t.ok(result, 'found result.');
        t.equal(result, 'data', 'inserted data.');
    });

});
