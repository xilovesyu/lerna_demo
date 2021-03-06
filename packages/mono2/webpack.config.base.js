const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const htmlWebpackPluginConfigs = require('./htmlWebpackPluginConfig.js')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const MomentLocalesPlugin = require('moment-locales-webpack-plugin')//removed unused moment locales

module.exports = (env, args) => {
    const mode = args.mode ? args.mode : 'production'
    const isProduction = mode === 'production'
    console.log('mode:', mode)
    return (
        {
            mode: mode,
            devtool: isProduction ? false : 'source-map',
            entry: ['./src/index.tsx'],
            output: {
                path: path.resolve(__dirname, 'build'), //must be absolute path,
                filename: 'index.bundle.[hash:6].js'
            },
            externals: {
                'react': 'React', //for import react from html with cdn
                'react-dom': 'ReactDOM'
            },
            resolve: {
                extensions: ['.ts', '.tsx', '.web.js', '.js', '.json', '.css', '.png', '.gif', '.svg']
            },
            module: {
                rules: [
                    {
                        test: /\.js[x]?$/,
                        use: 'babel-loader',
                        exclude: /node_modules/
                    },
                    {
                        test: /\.ts[x]?/,
                        use: 'babel-loader',
                        include: path.join(__dirname, 'src'),
                        exclude: /node_modules/
                    },
                    {
                        test: /\.less/,
                        use: [{
                            loader: MiniCssExtractPlugin.loader,
                            options: {
                                hmr: !isProduction,
                                reloadAll: true,
                                stats: {
                                    all: false,
                                    assets: true,
                                    cachedAssets: true,
                                    errors: true,
                                    errorDetails: true,
                                    hash: true,
                                    performance: true,
                                    publicPath: true,
                                    timings: true
                                }
                            }
                        }, 'css-loader', {
                            loader: 'postcss-loader',
                            options: {
                                plugins: function () {
                                    return [
                                        require('autoprefixer')()
                                    ]
                                }
                            }
                        }, {
                            loader: 'less-loader',
                            options: {
                                javascriptEnabled: true
                            }
                        }],
                        exclude: /node_modules/
                    },
                    //loader for antd styles.
                    {
                        test: /\.less/,
                        use: [{
                            loader: MiniCssExtractPlugin.loader,
                            options: {
                                hmr: !isProduction,
                                reloadAll: true
                            }
                        }, {
                            loader: 'css-loader'
                        }, {
                            loader: 'less-loader',
                            options: {
                                modifyVars: {
                                    'primary-color': '#1DA57A',
                                    'link-color': '#ff9af4',
                                    'success-color': '#52c41a',
                                    'font-size-base': '16px',
                                    'border-radius-base': '4px',

                                    //dark mode
                                    //'hack': `true;@import "${require.resolve('antd/lib/style/color/colorPalette.less')}";`,
                                    // ...darkThemeVars
                                },
                                javascriptEnabled: true
                            }
                        }],
                        include: [path.join(__dirname, '../../node_modules/antd')]
                    },
                    {
                        test: /\.(jpg|png|gif|webp|svg|eot|ttf|woff|woff2)/,
                        use: [
                            {
                                loader: 'url-loader',
                                options: {
                                    name: '[name]-[hash:5].[ext]',
                                    limit: 1024,
                                    esModule: false,
                                    outputPath: 'assets'
                                }
                            }
                        ],
                        exclude: /node_modules/
                    }
                ]
            },
            plugins: [
                new HtmlWebpackPlugin({
                    template: './src/index.html',
                    filename: 'index.html',
                    config: htmlWebpackPluginConfigs[isProduction ? 'production' : 'development']
                }),
                new CleanWebpackPlugin(),
                new MiniCssExtractPlugin({
                    filename: 'css/[name].css'
                }),
                new MomentLocalesPlugin({
                    localesToKeep: ['es-us', 'fr', 'zh-cn']
                })
            ]
        }
    )
}
