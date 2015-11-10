'use strict';

var Dns = require('dns');
var Assert = require('assert');
var Util = require('util');
var Trie = require('./trie');

export default function ({ttl = 300} = {}) {
    Assert.ok(Util.isNumber(ttl), 'Expected ttl to be a number.');

    let delegate = Object.assign({
        _cache: Trie()
    }, Dns);

    let cachewrap = (fn) => {
        return (...args) => {
            let time = Date.now();
            let hostname = args[0];
            let callback = args[args.length - 1];
            let entry = delegate._cache.search(hostname);

            args[args.length - 1] = (...argv) => {
                let time = Date.now();
                let error = argv[0];

                if (!error) {
                    delegate._cache.insert(hostname, {
                        time: time,
                        value: argv.slice(1)
                    });
                }
                callback.apply(null, argv);
            };

            if (!entry || time >= (entry.time + ttl)) {
                fn.apply(null, args);
                return;
            }

            entry.value.unshift(null);

            callback.apply(null, entry.value);
        };
    };

    Object.keys(delegate).forEach((key) => {
        if (key === 'setServers' || key === 'getServers') {
            return;
        }

        let fn = delegate[key];

        if (Util.isFunction(fn)) {
            delegate[key] = cachewrap(fn);
        }
    });

    return delegate;
};
