type ConfigType = {
  dependencies: Array<any>;
  plugins: Array<any>;
  nextConfig: any;
};

type withGluestackParam = {
  config: ConfigType;
  phase?: Array<any>;
};

export default function withGluestack(
  config: ConfigType = { dependencies: [], plugins: [], nextConfig: {} },
  phase: Array<any> = []
): withGluestackParam {
  let dependencies = [
    'react-native-web',
    '@dank-style/react',
    '@dank-style/css-injector',
    '@gluestack/next-adapter',
  ];

  if (config.dependencies !== undefined) {
    dependencies = [...dependencies, ...config.dependencies];
  }

  const withPlugins = require('next-compose-plugins');
  const withTM = require('next-transpile-modules')(dependencies);
  return withPlugins(
    [withTM, ...(config.plugins || [])],
    {
      webpack: (config: any) => {
        config.resolve.alias = {
          ...(config.resolve.alias || {}),
          'react-native$': 'react-native-web',
        };
        config.resolve.extensions = [
          '.web.js',
          '.web.ts',
          '.web.tsx',
          ...config.resolve.extensions,
        ];

        config.module.rules.push({
          test: /\.ttf$/,
          loader: 'url-loader',
        });

        return config;
      },
      ...(config.nextConfig && config.nextConfig),
    },
    [...phase]
  );
}
