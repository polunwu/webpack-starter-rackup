const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    // 用 ~@img alias 解析 img urls, 避免相對路徑過長造成混淆
    resolve: {
        alias: {
            '@img': path.resolve(__dirname, 'src/assets/images'),
        },
    },
    devtool: 'eval-cheap-module-source-map',
    entry: {
        home: './src/pages/home/home.js',
        about: './src/pages/about/about.js',
        works: './src/pages/works/works.js'
    },
    devServer: {
        port: 8080,
        open: true,
    },
    node: {
        fs: 'empty'
    },
    module: {
        rules: [
            {
                test: /\.html$/,
                use: [
                { loader: 'html-loader' }
                ]
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                options: {
                    presets: ['env']
                }
            },
            {
                test: /\.(scss|css|sass)$/,
                use: [
                    {
                        // creates style nodes from JS strings
                        loader: "style-loader",
                        options: {
                            sourceMap: true
                        }
                    },
                    {
                        // translates CSS into CommonJS
                        loader: "css-loader",
                        options: {
                            sourceMap: true
                        }
                    },
                    {
                        // compiles Sass to CSS
                        loader: "sass-loader",
                        options: {
                            outputStyle: 'expanded',
                            sourceMap: true,
                            sourceMapContents: true
                        }
                    }
                    // Please note we are not running postcss here
                ]
            }
            ,
            {
                // Load all images as base64 encoding if they are smaller than 8192 bytes
                test: /\.(png|jpe?g|gif)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            // On development we want to see where the file is coming from, hence we preserve the [path]
                            name: '[path][name].[ext]?hash=[hash:20]',
                            limit: 8192,
                        }
                    }
                ]
            },
            {
                // Load all svgs
                test: /\.svg/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[path][name].[ext]?hash=[hash:20]',
                        },
                    }
                ]
            },
            {
                // Load all fonts
                test: /\.(eot|woff|woff2|ttf)([\?]?.*)$/,
                use: [
                    {
                        loader: 'file-loader',
                    }
                ]
            }
        ],
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new HtmlWebpackPlugin({
            template: './src/pages/home/home.html',
            filename: 'index.html',
            chunks: ['home'] 
        }),
        new HtmlWebpackPlugin({
            template: './src/pages/about/about.html',
            filename: 'about.html',
            chunks: ['about'] 
        }),
        new HtmlWebpackPlugin({
            template: './src/pages/works/1.html',
            filename: 'works/1.html',
            chunks: ['works'] 
        }),
        new HtmlWebpackPlugin({
            template: './src/pages/works/2.html',
            filename: 'works/2.html',
            chunks: ['works'] 
        })
    ]
};
