const path = require('path');

const FaviconsWebpackPlugin = require('favicons-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin'); //installed via npm
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const buildPath = path.resolve(__dirname, 'dist');

module.exports = {
    // 用 ~@img alias 解析 img urls, 避免相對路徑過長造成混淆
    resolve: {
        alias: {
            '@img': path.resolve(__dirname, 'src/assets/images'),
        },
    },
    devtool: 'source-map',
    entry: {
        home: './src/pages/home/home.js',
        about: './src/pages/about/about.js',
        works: './src/pages/works/works.js',
    },
    output: {
        filename: './assets/js/[name].[chunkhash:8].js',
        path: buildPath
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
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            // ! 注意！
                            // 因為自訂了 MiniCssExtractPlugin 檔案路徑
                            // 會造成 css 內的 background-image url 路徑解析錯誤
                            // 因此要將 public path 指回根目錄
                            publicPath: '../../'
                        }
                    },
                    {
                        // translates CSS into CommonJS
                        loader: 'css-loader',
                        options: {
                            sourceMap: true
                        }
                    },
                    {
                        // Runs compiled CSS through postcss for vendor prefixing
                        loader: 'postcss-loader',
                        options: {
                            sourceMap: true
                        }
                    },
                    {
                        // compiles Sass to CSS
                        loader: 'sass-loader',
                        options: {
                            outputStyle: 'expanded',
                            sourceMap: true,
                            sourceMapContents: true
                        }
                    }
                ]
            },
            {
                // Load all images as base64 encoding if they are smaller than 8192 bytes
                test: /\.(png|jpe?g|gif)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            name: '[name].[hash:20].[ext]',
                            limit: 8192,
                            outputPath: 'assets/images'
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
                            name: '[name].[hash:20].[ext]',
                            outputPath: 'assets/images',
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
                        options: {
                            outputPath: 'assets/fonts',
                        },
                    }
                ]
            }
        ]
    },
    plugins: [
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
        }),
        new CleanWebpackPlugin(buildPath),
        new FaviconsWebpackPlugin({
            // Your source logo
            logo: './src/assets/images/icon.png',
            // The prefix for all image files (might be a folder or a name)
            prefix: 'icons-[hash]/',
            // Generate a cache file with control hashes and
            // don't rebuild the favicons until those hashes change
            persistentCache: true,
            // Inject the html into the html-webpack-plugin
            inject: true,
            // favicon background color (see https://github.com/haydenbleasel/favicons#usage)
            background: '#fff',
            // favicon app title (see https://github.com/haydenbleasel/favicons#usage)
            title: 'my-project',

            // which icons should be generated (see https://github.com/haydenbleasel/favicons#usage)
            icons: {
                android: true,
                appleIcon: true,
                appleStartup: true,
                coast: false,
                favicons: true,
                firefox: true,
                opengraph: false,
                twitter: false,
                yandex: false,
                windows: false
            }
        }),
        new MiniCssExtractPlugin({
            filename: './assets/css/[name].[contenthash].css'
        }),
        new OptimizeCssAssetsPlugin({
            cssProcessor: require('cssnano'),
            cssProcessorOptions: {
                map: {
                    inline: false,
                },
                discardComments: {
                    removeAll: true
                },
                discardUnused: false
            },
            canPrint: true
        })
    ]
};
