"use strict";

var _core = require("babel-runtime/core-js")["default"];

var Dns = require("dns");
var Assert = require("assert");
var Util = require("util");
var Trie = require("./trie");

module.exports = function () {
	var _arguments = arguments;

	var _ref = arguments[0] === undefined ? {} : arguments[0];

	var _ref$ttl = _ref.ttl;
	var ttl = _ref$ttl === undefined ? 300 : _ref$ttl;
	var _ref$size = _ref.size;
	var size = _ref$size === undefined ? 1000 : _ref$size;

	Assert.ok(Util.isNumber(ttl), "Expected ttl to be a number.");
	Assert.ok(Util.isNumber(size), "Expected size to be a number.");

	var delegate = _core.Object.assign({
		_cache: Trie()
	}, Dns);

	var cachewrap = function (fn) {
		return function () {
			for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
				args[_key] = arguments[_key];
			}

			var time = Date.now();
			var hostname = args[0];
			var callback = args[2];

			var entry = delegate._cache.search(hostname);

			args[args.length - 1] = function (error, results) {
				if (!error) {
					delegate._cache.insert(hostname, {
						time: Date.now(),
						value: results
					});
				}
				callback.apply(null, _arguments);
			};

			if (!entry || time >= entry.time + ttl) {
				fn.apply(null, args);
				return;
			}

			callback(null, entry.value);
		};
	};

	_core.Object.keys(delegate).forEach(function (key) {
		if (key === "setServers" || key === "getServers") {
			return;
		}

		var fn = delegate[key];

		if (Util.isFunction(fn)) {
			delegate[key] = cachewrap(fn);
		}
	});

	return delegate;
};