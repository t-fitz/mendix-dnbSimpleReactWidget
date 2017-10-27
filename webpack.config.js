const webpack = require("webpack");
const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const ZipPlugin = require('zip-webpack-plugin');
const pkg = require('./package.json');

const widgetConfig = {
    entry: "./src/components/HelloWorld.ts",
    output: {
        path: path.resolve(__dirname, "dist/build"),
        filename: "com/mendix/widget/custom/HelloWorld/HelloWorld.js",
        libraryTarget:  "umd"
    },
    resolve: {
        extensions: [ ".ts", ".js" ]
    },
    module: {
        rules: [
            { test: /\.ts$/, loader: "ts-loader" },
            { test: /\.css$/, loader: ExtractTextPlugin.extract({
                fallback: "style-loader",
                use: "css-loader"
            }) },
            { test: /\.scss$/, loader: ExtractTextPlugin.extract({
                fallback: "style-loader",
                use: [
                    { loader: "css-loader" },
                    { loader: "sass-loader" }
                ]
            }) }
        ]
    },
    externals: [ "react", "react-dom" ],
    plugins: [
        new CopyWebpackPlugin([ { from: "src/*.xml", flatten: true } ], { copyUnmodified: true }),
        new CopyWebpackPlugin([ { from: "dist/build/*.webmodeler.*", flatten: true } ], { copyUnmodified: true }),
        new ExtractTextPlugin({ filename: "./com/mendix/widget/custom/HelloWorld/ui/HelloWorld.css" }),
        new ZipPlugin({
            path: path.resolve(__dirname, "dist/" + pkg.version),
            filename: 'HelloWorld',       
            extension: 'mpk'
        })
    ]
};

const previewConfig = {
    entry: "./src/HelloWorld.webmodeler.ts",
    output: {
        path: path.resolve(__dirname, "dist/build"),
        filename: "HelloWorld.webmodeler.js",
        libraryTarget: "commonjs"
    },
    resolve: {
        extensions: [ ".ts", ".js" ]
    },
    module: {
        rules: [
            { test: /\.ts$/, use: "ts-loader" },
            { test: /\.css$/, use: "raw-loader" },
            { test: /\.scss$/, use: [
                    { loader: "raw-loader" },
                    { loader: "sass-loader" }
                ]
            }
        ]
    },
    externals: [ "react", "react-dom" ],
    plugins: []
};

module.exports = [ previewConfig, widgetConfig ];