export default function withGluestackUI({ transpileModules, nextConfig }: any) {
  let gluestackUITranspileModules = Array.from(
    new Set([
      'react-native-web',
      '@dank-style/react',
      '@dank-style/css-injector',
      '@gluestack/ui-next-adapter',
      '@universa11y/provider',
      '@react-native-aria/overlays',
      '@universa11y/overlay',
      '@react-native-aria/utils',
      '@universa11y/react-native-aria',
      '@universa11y/toast',
      '@universa11y/transitions',
      ...transpileModules,
    ])
  );

  const withPlugins = require('next-compose-plugins');
  const withTM = require('next-transpile-modules')([
    ...gluestackUITranspileModules,
  ]);

  const updatedNextConfig = {
    ...nextConfig,
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
  };

  return withPlugins([withTM], updatedNextConfig);
}
