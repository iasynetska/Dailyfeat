const path = require("path");
const glob = require("glob")
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const PurgecssPlugin = require("purgecss-webpack-plugin");

const PATHS = {
    src: path.resolve(__dirname, 'src')
};

module.exports = {
    entry: {
        server: "./server/app.js",
        pageOne: "./src/pageOne/app.js",
        pageTwo: "./src/pageTwo/app.js"
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: "js/[name].js",
    },
    watch: false,
    mode: "development",
    devtool: "source-map",
    devServer: {
        publicPath: '/dist/',
        watchContentBase: true
    },
    module: {
        rules: [
            {
                test: /\.(html)$/,
                use: ['html-loader']
            },
            {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                        plugins: [
                            '@babel/plugin-proposal-object-rest-spread',
                            "@babel/plugin-transform-runtime"
                        ],
                        comments: false
                    }
                }
            },
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, "css-loader"]
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                loader: 'file-loader',
                options: {
                    outputPath: 'images'
                },
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "src/pageOne/index.html",
            inject: true,
            chunks: ['pageOne'],
            filename: 'pageOne.html'
        }),
        new HtmlWebpackPlugin({
            template: "src/pageTwo/index.html",
            inject: true,
            chunks: ['pageTwo'],
            filename: 'pageTwo.html'
        }),
        new MiniCssExtractPlugin({
            filename: 'styles/[name].css'
        }),
        new PurgecssPlugin({
            paths: glob.sync(`${PATHS.src}/**/*`, { nodir: true }),
        }),
    ]
}