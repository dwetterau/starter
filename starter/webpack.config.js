module.exports = {
    entry: "./static/js/main.tsx",
    output: {
        path: __dirname + "/static/dist/dev",
        filename: "bundle.js"
    },

    devtool: "eval-source-map",

    resolve: {
        // Add '.ts' and '.tsx' as resolvable extensions
        extensions: [".webpack.js", ".web.js", ".ts", ".tsx", ".js"]
    },

    module: {
        rules: [
            // All files with a '.ts' or '.tsx' extension will be handled by 'ts-loader'.
            {test: /\.tsx?$/, loader: "ts-loader"},
            {test: /\.(ttf|woff|woff2)$/, loader: 'file-loader?name=/static/fonts/[name].[ext]'},
            {test: /\.css$/, loader: "style-loader!css-loader"}
        ]
    },
    dependencies: [
        'node_modules/jquery',
        'node_modules/react',
        'node_modules/react-dom',
        'node_modules/react-markdown',
        'node_modules/react-router-dom',
        'node_modules/react-textarea-autosize',
        'node_modules/react-datetime',
        'node_modules/moment',
    ],
    mode: "development",
};
