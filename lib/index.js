'use strict';

var Dns = require('dns');
var Assert = require('assert');
var Util = require('util');
var Trie = require('./trie');

export default function ({ttl = 300} = {}) {
	Assert.ok(Util.isNumber(ttl), 'Expected ttl to be a number.');
	Assert.ok(Util.isNumber(size), 'Expected size to be a number.');

	let delegate = Object.assign({
		_cache: Trie()
	}, Dns);

	let cachewrap = (fn) => {
		return (...args) => {
			let time = Date.now();
			let [hostname, , callback] = args;
			let entry = delegate._cache.search(hostname);

			args[args.length - 1] = (error, results) => {
				if (!error) {
					delegate._cache.insert(hostname, {
						time: Date.now(),
						value: results
					});
				}
				callback.apply(null, arguments);
			};

			if (!entry || time >= (entry.time + ttl)) {
				fn.apply(null, args);
				return;
			}

			callback(null, entry.value);
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
