const path = require('path');
import { getDependenciesFromNodeModules, checkIfWorkspace } from './utils';

export default function withGluestackUI(nextConfig: any = {}) {
  const currDir = process.cwd();

  const metaWorkspace = checkIfWorkspace(currDir);

  const rootDependencyList = getDependenciesFromNodeModules(currDir, [
    '@gluestack-ui',
    '@react-native-aria',
  ]);

  let parentDependencyList = [];

  if (metaWorkspace.isWorkspace) {
    parentDependencyList = getDependenciesFromNodeModules(
      path.resolve(currDir, '..'),
      ['@gluestack-ui', '@react-native-aria']
    );
  }

  let gluestackUITranspileModules = Array.from(
    new Set([
      'react-native',
      'react-native-web',
      '@dank-style/react',
      '@dank-style/css-injector',
      '@gluestack/ui-next-adapter',
      ...rootDependencyList,
      ...parentDependencyList,
      ...(nextConfig.transpilePackages || []),
    ])
  );

  const updatedNextConfig = {
    ...nextConfig,
    transpilePackages: gluestackUITranspileModules,
    webpack: (config: any) => {
      config = nextConfig.webpack ? nextConfig.webpack(config) : config;

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

  return updatedNextConfig;
}
