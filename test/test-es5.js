'use strict';

var Test = require('tape');
var Dns = require('../dist/lib');

Test('es5', function (t) {
    var dns;

    t.test('create', function (t) {
        t.plan(1);

        dns = Dns({});

        dns.lookup('localhost', function (error, results) {
            t.ok(!error, 'no error.');
        });
    });

});
