module.exports = {
    presets: [
        [
            '@babel/env',
            {
                useBuiltIns: 'usage',
                shippedProposals: true,
                targets: {
                    node: 8,
                },
            },
        ],
        '@babel/typescript',
        [
            '@babel/stage-0',
            {
                decoratorsLegacy: true,
            },
        ],
    ],
};
