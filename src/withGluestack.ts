import {
  checkIfWorkspace,
  getDependenciesFromNodeModules,
  getExactDependenciesFromNodeModules,
} from './utils';
const findWorkspaceRoot = require('find-yarn-workspace-root');
const path = require('path');

export default function withGluestackUI(nextConfig: any = {}) {
  const currDir = process.cwd();

  const rootDependencyList = getDependenciesFromNodeModules(currDir, [
    '@gluestack-ui',
    '@react-native-aria',
    '@dank-style',
    '@gluestack',
    '@expo',
    '@legendapp',
  ]);

  const rootExactDependencyList = getExactDependenciesFromNodeModules(currDir, [
    'react-native',
    'react-native-web',
    'react-native-svg',
  ]);

  const workspaceRoot = findWorkspaceRoot(currDir); // Absolute path or null
  const metaWorkspace = checkIfWorkspace(currDir);

  let parentDependencyList = [];
  let parentExactDependencyList = [];

  if (metaWorkspace.isWorkspace) {
    parentDependencyList = getDependenciesFromNodeModules(
      path.resolve(currDir, '..'),
      [
        '@gluestack-ui',
        '@react-native-aria',
        '@dank-style',
        '@gluestack',
        '@expo',
        '@legendapp',
      ]
    );
    parentExactDependencyList = getExactDependenciesFromNodeModules(
      path.resolve(currDir, '..'),
      ['react-native', 'react-native-web', 'react-native-svg']
    );
  }

  if (workspaceRoot) {
    parentDependencyList = getDependenciesFromNodeModules(workspaceRoot, [
      '@gluestack-ui',
      '@react-native-aria',
      '@legendapp',
      '@expo/html-elements',
      'gluestack',
      '@dank-style',
    ]);
    parentExactDependencyList = getExactDependenciesFromNodeModules(
      workspaceRoot,
      ['react-native', 'react-native-web', 'react-native-svg']
    );
  }

  let gluestackUITranspileModules = Array.from(
    new Set([
      ...rootDependencyList,
      ...parentDependencyList,
      ...rootExactDependencyList,
      ...parentExactDependencyList,
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
