const config = require('./webpack.config');

module.exports = {
    config,
    dev: {
        stats: 'minimal',
        logTime: true,
    },
    port: 1488,
    host: '0.0.0.0',
    hot: {
        port: 1337,
        logTime: true,
    },
    content: './dist/',
    logTime: true,
    clipboard: false,
};
