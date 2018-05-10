import { plugin } from 'postcss';
import parseValue, { stringify, Node } from 'postcss-value-parser';

const noSpace = (node: Node) => node.type !== 'space';
const noAnd = (node: Node) => node.type !== 'word' || node.value !== 'and';
const noOnly = (node: Node) => node.type !== 'word' || node.value !== 'only';
const uniq = <A extends any>(as: A[]): A[] => [...new Set(as)];
const rename = (x: string): string => `[data-managed-media-${x.replace(/^--/, '')}]`;

const split = (nodes: Node[]) => {
    const parts: Node[][] = [];

    let part: Node[] = [];
    let divided: boolean = false;

    for (const node of nodes) {
        if (node.type === 'div' && node.value === ',') {
            parts.push(part);

            part = [];
            divided = true;
        } else {
            part.push(node);

            divided = false;
        }
    }

    if (!divided) {
        parts.push(part);
    }

    return parts;
};

export default plugin('postcss-managed-media', () => root => {
    const registry: string[] = [];

    root.walkAtRules(at => {
        if (at.name === 'managed-media') {
            registry.push(at.params);

            at.remove();
        }
    });

    root.walkAtRules(at => {
        const parsed = parseValue(at.params).nodes;

        const filtered = parsed
            .filter(noSpace)
            .filter(noAnd)
            .filter(noOnly);

        const media: string[] = [];
        const attrs: string[] = [];

        for (const query of split(filtered)) {
            const features: string[] = [];
            const attrs_: string[] = [];

            let negated = false;

            for (const feature of query) {
                if (feature.type === 'word' && feature.value === 'not') {
                    negated = true;

                    continue;
                }

                if (feature.type === 'word' && registry.includes(feature.value)) {
                    attrs_.push(rename(feature.value));

                    continue;
                }

                if (feature.type === 'function' && feature.nodes.length === 1 && registry.includes(feature.nodes[0].value)) {
                    attrs_.push(rename(feature.nodes[0].value));

                    continue;
                }

                features.push(stringify(feature));
            }

            const rawMedia = features.join(' and ');

            media.push(`${negated && rawMedia ? 'not ' : ''}${rawMedia || 'all'}`);

            if (attrs_.length > 0) {
                const joined: string = attrs_.join('');

                if (negated) {
                    attrs.push(`:root:not(${joined})`);
                } else {
                    attrs.push(`:root${joined}`);
                }
            } else {
                attrs.push('');
            }
        }

        at.params = media.join(', ');

        for (const node of at.nodes || []) {
            if (node.type !== 'rule') {
                // TODO: Warn.

                continue;
            }

            const selectors = node.selectors || [];

            node.selectors = uniq(
                selectors.reduce(
                    (result, selector) => [
                        ...result,
                        ...attrs.reduce((result, attr) => [...result, `${attr} ${selector}`.trim(), `${attr}${selector}`.trim()], [] as string[]),
                    ],
                    [] as string[],
                ),
            );
        }
    });
});
