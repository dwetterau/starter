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
        'node_modules/react-textarea-autosize',
        'node_modules/react-datetime',
    ],
    // When importing a module whose path matches one of the following, just
    // assume a corresponding global variable exists and use that instead.
    // This is important because it allows us to avoid bundling all of our
    // dependencies, which allows browsers to cache those libraries between builds.
    externals: {
        "react": "React",
        "react-dom": "ReactDOM",
        "react-markdown": "reactMarkdown",
        "react-router-dom": "ReactRouterDOM",
        "jquery": "jQuery",
        "moment": "moment",
    },
    mode: "development",
};
