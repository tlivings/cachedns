'use strict';

const Dns = require('dns');
const Assert = require('assert');
const Util = require('util');

const cachedns = function ({ttl = 300} = {}) {
    Assert.ok(Util.isNumber(ttl), 'Expected ttl to be a number.');

    const delegate = Object.assign({
        _cache: {}
    }, Dns);

    const makeKey = function (name, args) {
        const hostname = args[0];
        const key = `${name}_${hostname}`;
        let option = args[args.length - 2];

        if (hostname === option) {
            return key;
        }

        if (Util.isObject(option)) {
            option = Object.keys(option).map((k) => {
                return `${k}_${option[k]}`;
            }).join('_');
        }

        return `${key}_${option}`;
    };

    const now = function () {
        if (now.cached !== null) {
            return now.cached;
        }
        now.cached = Date.now();
        return now.cached;
    };

    now.clear = function () {
        now.cached = null;
    };

    now.cached = null;

    const cachewrap = function (name, fn) {
        return (...args) => {
            const time = now();
            const callback = args[args.length - 1];
            const key = makeKey(name, args);
            const entry = delegate._cache[key];

            args[args.length - 1] = (error, ...argv) => {
                const time = now();

                if (error) {
                    callback(error);
                    return;
                }

                argv.unshift(null);

                delegate._cache[key] = {
                    time: time,
                    value: argv
                };

                callback.apply(null, argv);
            };

            if (!entry || time >= (entry.time + ttl)) {
                fn.apply(null, args);
                return;
            }

            process.nextTick(() => {
                now.clear();
                callback.apply(null, entry.value);
            });
        };
    };


    Object.keys(delegate).forEach((key) => {
        if (key === 'setServers' || key === 'getServers') {
            return;
        }

        const fn = delegate[key];

        if (Util.isFunction(fn)) {
            delegate[key] = cachewrap(key, fn);
        }
    });

    return delegate;
};

module.exports = cachedns;
