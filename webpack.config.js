const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const webpack = require('webpack')
module.exports = {
    entry: {
        app: "./src/main.js"
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, "build"),
        publicPath: "",
        filename: "bundle.js"
    },
    resolve: {

    },
    devServer: {
        inline: false,
        compress: true
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/preset-env']
                },
                exclude: /node_modules/
            },
            {
                test: /\.s?css$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: ['css-loader', 'sass-loader']
                })
            },
            {
                test: /\.(svg|ttf|woff|woff2)$/,
                use: [
                    'file-loader'
                ]
            },
            {
                test: /\.(jpg|png|gif)$/,
                loader: 'url-loader?limit=8192&name=../img/[name].[ext]'
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, 'template/example.html'),
            filename: 'example.html',
            chunks: ['app']
        }),
        new webpack.HotModuleReplacementPlugin(),
        new ExtractTextPlugin("styles.css")
    ],
    optimization: {

    }
}