var webpack = require('webpack'),
    path = require('path'),
    fs = require('fs'),
    HtmlWebpackPlugin = require('html-webpack-plugin'),
    ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    entry: {
        app: path.join(__dirname,'src','index.js')
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    mode: 'development',
    devServer: {
        contentBase: path.join(__dirname, "dist"),
        hot: true,
        inline: true
    },
    resolve: {
        extensions: ['.js', '.json']
    },
    module: {
        rules: [{
            test: /\.js?$/,
            exclude: /(node_modules|bower_components)/,
            loader: 'babel-loader',
            query: {
                presets: ['es2015', 'react']
            }

        }, {
            test: /\.css$/,
            exclude: /^node_modules$/,
            loader: ExtractTextPlugin.extract('style', ['css', 'autoprefixer'])
        }, {
            test: /\.less$/,
            exclude: /^node_modules$/,
            loader: ['style-loader', 'css-loader', 'less-loader']
        }
        ]
    }
};