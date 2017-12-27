module.exports = {
  webpack: (config, options, webpack) => {
    config.entry.main = [
      './src/index.ts'
    ]

    config.resolve = {
      extensions: [".ts", ".js", ".json"]
    };

    config.module.rules.push(
      // {
      //   test: /\.ts$/,
      //   loader: 'lodash-ts-imports-loader',
      //   exclude: /node_modules/,
      //   enforce: "pre"
      // },
      {
        test: /^(?!.*\.spec\.ts$).*\.ts$/,
        loader: 'awesome-typescript-loader',
      }
    );

    config.plugins.push(
      new webpack.optimize.ModuleConcatenationPlugin(),
      new webpack.BannerPlugin({
        banner: '#!/usr/bin/env node',
        raw: true,
      }),
    )

    return config
  }
}