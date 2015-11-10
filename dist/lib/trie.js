"use strict";

module.exports = trie;

function trie() {
    var root = {
        nodes: {}
    };

    return {
        insert: function insert(path, value) {
            var current = root;
            var length = path.length - 1;
            var last = 0;
            var idx = 0;

            while (idx <= length) {
                var c = path[idx++];
                var end = idx >= length + 1;

                if (current.nodes[c]) {
                    current = current.nodes[c];
                    continue;
                }

                current = current.nodes[c] = { nodes: {} };

                current.name = c;
                current.end = end;

                if (end) {
                    current.value = value;
                    current.description = path;
                }
            }
        },

        search: function search(path) {
            var current = root;
            var length = path.length - 1;

            for (var idx = 0, c = undefined; idx <= length; idx++) {
                c = path[idx];

                if (!current.nodes[c]) {
                    return undefined;
                }

                current = current.nodes[c];
            }

            if (current.end) {
                return current.value;
            }

            return undefined;
        }
    };
}