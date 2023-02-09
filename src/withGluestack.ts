const path = require('path');
import { getDependenciesFromNodeModules, checkIfWorkspace } from './utils';

export default function withGluestackUI(
  nextConfig: any = {},
  transpileModules: any = []
) {
  const currDir = process.cwd();

  const metaWorkspace = checkIfWorkspace(currDir);

  const rootDependencyList = getDependenciesFromNodeModules(currDir, [
    '@universa11y',
    '@react-native-aria',
  ]);

  let parentDependencyList = [];

  if (metaWorkspace.isWorkspace) {
    parentDependencyList = getDependenciesFromNodeModules(
      path.resolve(currDir, '..'),
      ['@universa11y', '@react-native-aria']
    );
  }

  let gluestackUITranspileModules = Array.from(
    new Set([
      'react-native-web',
      '@dank-style/react',
      '@dank-style/css-injector',
      '@gluestack/ui-next-adapter',
      ...rootDependencyList,
      ...parentDependencyList,
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
