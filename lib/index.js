'use strict';

import Dns from 'dns';
import Assert from 'assert';
import Util from 'util';

export default function ({ttl = 300} = {}) {
    Assert.ok(Util.isNumber(ttl), 'Expected ttl to be a number.');

    let delegate = Object.assign({
        _cache: {}
    }, Dns);

    let makeKey = (name, args) => {
        let hostname = args[0];
        let key = `${name}_${hostname}`;
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

    let cachewrap = (name, fn) => {
        return (...args) => {
            let time = Date.now();
            let hostname = args[0];
            let callback = args[args.length - 1];
            let key = makeKey(name, args);
            let entry = delegate._cache[key];

            args[args.length - 1] = (error, ...argv) => {
                let time = Date.now();

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
                callback.apply(null, entry.value);
            });
        };
    };

    Object.keys(delegate).forEach((key) => {
        if (key === 'setServers' || key === 'getServers') {
            return;
        }

        let fn = delegate[key];

        if (Util.isFunction(fn)) {
            delegate[key] = cachewrap(key, fn);
        }
    });

    return delegate;
};
