'use strict';

export default function trie() {
    let root = {
        nodes: {}
    };

    return {
        insert(path, value) {
            let current = root;
            let length = path.length - 1;
            let last = 0;
            let idx = 0;

            while (idx <= length) {
                let c = path[idx++];
                let end = idx >= length + 1;

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

        search(path) {
            let current = root;
            let length = path.length - 1;

            for (let idx = 0, c; idx <= length; idx++) {
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
};
