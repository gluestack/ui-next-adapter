import {
  checkIfWorkspace,
  getDependenciesFromNodeModules,
  getExactDependenciesFromNodeModules,
} from './utils';
const findWorkspaceRoot = require('find-yarn-workspace-root');

const {DefinePlugin} = require("webpack")

const gluestackDeps = [
  '@gluestack-ui',
  '@react-native-aria',
  '@gluestack-style',
  '@gluestack',
  '@expo',
  '@legendapp',
  'expo-',
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

  let rootExactDependencyList = [];
  try {
    rootExactDependencyList = getExactDependenciesFromNodeModules(
      currDir,
      reactNativeDeps
    );
  } catch (e) {}

  const workspaceRoot = findWorkspaceRoot(currDir); // Absolute path or null
  const metaWorkspace = checkIfWorkspace(currDir);
  let parentDependencyList = [];
  let parentExactDependencyList = [];

  if (metaWorkspace.isWorkspace) {
    try {
      parentDependencyList = getDependenciesFromNodeModules(
        metaWorkspace.workspacePath,
        gluestackDeps
      );
      parentExactDependencyList = getExactDependenciesFromNodeModules(
        metaWorkspace.workspacePath,
        reactNativeDeps
      );
    } catch (e) {}
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
    try {
      parentDependencyList = getDependenciesFromNodeModules(
        workspaceRoot,
        gluestackDeps
      );
      parentExactDependencyList = getExactDependenciesFromNodeModules(
        workspaceRoot,
        reactNativeDeps
      );
    } catch (e) {}
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
        '.web.jsx',
        ...config.resolve.extensions,
      ];

      config.module.rules.push({
        test: /\.ttf$/,
        loader: 'url-loader',
      });

      config.plugins.push(
        new DefinePlugin({
          __DEV__: JSON.stringify(process.env.NODE_ENV !== 'production'),
        })
      );

      return config;
    },
  };

  return updatedNextConfig;
}
