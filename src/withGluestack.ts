import {
  checkIfWorkspace,
  getDependenciesFromNodeModules,
  getExactDependenciesFromNodeModules,
} from './utils';
const findWorkspaceRoot = require('find-yarn-workspace-root');
const path = require('path');

const gluestackDeps = [
  '@gluestack-ui',
  '@react-native-aria',
  '@gluestack-style',
  '@gluestack',
  '@expo',
  '@legendapp',
];

const reactNativeDeps = [
  'react-native',
  'react-native-web',
  'react-native-svg',
];

export default function withGluestackUI(nextConfig: any = {}) {
  const currDir = process.cwd();
  let rootDependencyList = [];
  try {
    rootDependencyList = getDependenciesFromNodeModules(currDir, gluestackDeps);
  } catch (e) {}

  const rootExactDependencyList = getExactDependenciesFromNodeModules(
    currDir,
    reactNativeDeps
  );

  const workspaceRoot = findWorkspaceRoot(currDir); // Absolute path or null
  const metaWorkspace = checkIfWorkspace(currDir);

  let parentDependencyList = [];
  let parentExactDependencyList = [];

  if (metaWorkspace.isWorkspace) {
    parentDependencyList = getDependenciesFromNodeModules(
      path.resolve(currDir, '..'),
      gluestackDeps
    );
    parentExactDependencyList = getExactDependenciesFromNodeModules(
      path.resolve(currDir, '..'),
      reactNativeDeps
    );
  }

  // if (metaWorkspace.isWorkspace) {
  //   parentDependencyList = getDependenciesFromNodeModules(
  //     path.resolve(currDir, '..'),
  //     ['@gluestack-ui', '@react-native-aria']
  //   );
  // }

  // if (workspaceRoot) {
  //   parentDependencyList = getDependenciesFromNodeModules(workspaceRoot, [
  //     '@gluestack-ui',
  //     '@react-native-aria',
  //     '@legendapp',
  //     '@expo/html-elements',
  //     'gluestack',
  //   ]);
  // }
  if (workspaceRoot) {
    parentDependencyList = getDependenciesFromNodeModules(
      workspaceRoot,
      gluestackDeps
    );
    parentExactDependencyList = getExactDependenciesFromNodeModules(
      workspaceRoot
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
