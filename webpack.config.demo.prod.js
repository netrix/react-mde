const path = require('path');
const ExtractTextPlugin = require('mini-css-extract-plugin');

module.exports = {
    mode: "production",

    entry: [
        './demo/client.tsx'
    ],

    output: {
        filename: 'bundle-prod.js',
        path: path.resolve(__dirname, 'docs'),
        publicPath: '/react-mde/'
    },

    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx', '.css', '.scss', '.json']
    },

    module: {
        rules: [
            {
                test: /\.ts(x?)/,
                use: {
                    loader: 'ts-loader',
                    options: {
                        configFile: "tsconfig.demo.prod.json"
                    },
                },
                exclude: /node_modules/,
            },
            {test: /\.css/, use: [ExtractTextPlugin.loader, "css-loader"]},
            {
                test: /\.scss/,
                use: [ExtractTextPlugin.loader, "css-loader", "sass-loader"]
            },
            {test: /\.jpe?g$|\.gif$|\.png$|\.ico$/, use: 'file-loader?name=[name].[ext]'},
            {test: /\.eot|\.ttf|\.svg|\.woff2?/, use: 'file-loader?name=[name].[ext]'},
        ]
    },

    plugins: [
        new ExtractTextPlugin(),
    ]
};
