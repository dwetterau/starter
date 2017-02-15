var webpack = require("webpack");
var config = require("./webpack.config.js");

config.output.path = require("path").resolve("./static/dist/");
config.output.publicPath = "/static/dist/";

config.plugins = config.plugins || [];
config.plugins = config.plugins.concat([
    // removes a lot of React debugging code
    new webpack.DefinePlugin({
        'process.env': {
            'NODE_ENV': JSON.stringify('production')
        }
    }),

    // keeps hashes consistent between compilations
    new webpack.optimize.OccurrenceOrderPlugin()
]);

delete config['devtool'];

module.exports = config;
