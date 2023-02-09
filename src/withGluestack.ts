const fs = require('fs-extra');

export default function withGluestackUI(
  nextConfig: any = {},
  transpileModules: any = []
) {
  const currDir = process.cwd();

  const packageJsonPath = `${currDir}/package.json`;
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

  const depMap: any = new Map();

  Object.keys(packageJson.dependencies).map((value: any) => {
    const prefix = value.split('/')[0];

    if (depMap.has(prefix)) {
      depMap.get(prefix).push(value);
    } else {
      depMap.set(prefix, [value]);
    }
  });

  const universa11yDependencies: any = {
    '@universa11y/button': ['@react-native-aria/focus', 'react-native-svg'],
    '@universa11y/actionsheet': [
      '@react-native-aria/focus',
      '@universa11y/hooks',
      '@universa11y/modal',
      '@universa11y/overlay',
      '@universa11y/react-native-aria',
      '@universa11y/transitions',
      '@universa11y/utils',
      'react-native-svg',
    ],
    '@universa11y/alert-dialog': [
      '@react-native-aria/focus',
      '@universa11y/hooks',
      '@universa11y/icon',
      '@universa11y/overlay',
      '@universa11y/react-native-aria',
      '@universa11y/transitions',
      '@universa11y/utils',
      'react-native-svg',
    ],
    '@universa11y/avatar': [
      '@react-native-aria/focus',
      '@universa11y/react-native-aria',
      '@universa11y/utils',
      'react-native-svg',
    ],
    '@universa11y/checkbox': [
      '@react-native-aria/checkbox',
      '@react-native-aria/focus',
      '@universa11y/form-control',
      '@universa11y/react-native-aria',
      '@universa11y/utils',
      'react-native-svg',
    ],
    '@universa11y/divider': ['@react-native-aria/focus', 'react-native-svg'],
    '@universa11y/fab': ['@react-native-aria/focus', 'react-native-svg'],
    '@universa11y/floating-ui': [
      '@floating-ui/react',
      '@floating-ui/react-native',
    ],
    '@universa11y/form-control': [
      '@react-native-aria/focus',
      '@universa11y/react-native-aria',
      '@universa11y/utils',
      'react-native-svg',
    ],
    '@universa11y/hooks': ['@react-native-aria/focus', 'react-native-svg'],
    '@universa11y/hstack': [
      '@react-native-aria/focus',
      '@universa11y/react-native-aria',
      '@universa11y/utils',
      'react-native-svg',
    ],
    '@universa11y/icon': [
      '@react-native-aria/focus',
      '@universa11y/react-native-aria',
      '@universa11y/ui-provider',
      '@universa11y/utils',
      'react-native-svg',
    ],
    '@universa11y/icon-button': [
      '@react-native-aria/focus',
      'react-native-svg',
    ],
    '@universa11y/input': [
      '@react-native-aria/focus',
      '@universa11y/form-control',
      '@universa11y/react-native-aria',
      '@universa11y/utils',
      'react-native-svg',
    ],
    '@universa11y/link': [
      '@react-native-aria/focus',
      '@react-native-aria/interactions',
      '@universa11y/react-native-aria',
      '@universa11y/utils',
      'react-native-svg',
    ],
    '@universa11y/menu': [
      '@universa11y/floating-ui',
      '@react-native-aria/focus',
      '@universa11y/overlay',
      '@universa11y/react-native-aria',
      '@universa11y/transitions',
      '@universa11y/utils',
      'react-native-svg',
    ],
    '@universa11y/modal': [
      '@react-native-aria/focus',
      '@universa11y/hooks',
      '@universa11y/icon',
      '@universa11y/overlay',
      '@universa11y/react-native-aria',
      '@universa11y/transitions',
      '@universa11y/utils',
      'react-native-svg',
    ],
    '@universa11y/overlay': [
      '@react-native-aria/focus',
      '@react-native-aria/overlays',
      'react-native-svg',
    ],
    '@universa11y/popover': [
      '@universa11y/floating-ui',
      '@react-native-aria/focus',
      '@universa11y/hooks',
      '@universa11y/overlay',
      '@universa11y/react-native-aria',
      '@universa11y/transitions',
      '@universa11y/utils',
      'react-native-svg',
    ],
    '@universa11y/popper': [
      '@react-native-aria/focus',
      'react-native-svg',
      '@universa11y/utils',
      '@universa11y/react-native-aria',
    ],
    '@universa11y/pressable': ['@react-native-aria/focus', 'react-native-svg'],
    '@universa11y/progress': ['@react-native-aria/focus', 'react-native-svg'],
    '@universa11y/provider': [
      '@react-native-aria/focus',
      '@universa11y/overlay',
      '@universa11y/react-native-aria',
      '@universa11y/toast',
      '@universa11y/transitions',
      '@universa11y/utils',
      'react-native-svg',
    ],
    '@universa11y/radio': [
      '@react-native-aria/focus',
      '@react-native-aria/radio',
      '@universa11y/form-control',
      '@universa11y/react-native-aria',
      '@universa11y/utils',
      'react-native-svg',
    ],
    '@universa11y/react-native-aria': [
      '@react-native-aria/focus',
      'react-native-svg',
    ],
    '@universa11y/select': [
      '@react-native-aria/focus',
      '@universa11y/hooks',
      '@universa11y/react-native-aria',
      '@universa11y/utils',
      'react-native-svg',
    ],
    '@universa11y/slider': [
      '@react-native-aria/focus',
      '@react-native-aria/interactions',
      '@react-native-aria/slider',
      '@react-stately/slider',
      '@universa11y/react-native-aria',
      '@universa11y/utils',
      'react-native-svg',
    ],
    '@universa11y/spinner': ['@react-native-aria/focus', 'react-native-svg'],
    '@universa11y/stack': ['@react-native-aria/focus', 'react-native-svg'],
    '@universa11y/switch': [
      '@react-native-aria/focus',
      '@react-native-aria/interactions',
      '@react-stately/toggle',
      'react-native-svg',
    ],
    '@universa11y/tabs': ['@react-native-aria/focus', 'react-native-svg'],
    '@universa11y/textarea': [
      '@react-native-aria/focus',
      '@universa11y/form-control',
      'react-native-svg',
    ],
    '@universa11y/toast': [
      '@react-native-aria/focus',
      '@universa11y/hooks',
      '@universa11y/overlay',
      '@universa11y/react-native-aria',
      '@universa11y/transitions',
      '@universa11y/utils',
      'react-native-svg',
    ],
    '@universa11y/tooltip': [
      '@universa11y/floating-ui',
      '@react-native-aria/focus',
      '@universa11y/hooks',
      '@universa11y/overlay',
      '@universa11y/react-native-aria',
      '@universa11y/transitions',
      '@universa11y/utils',
      'react-native-svg',
    ],
    '@universa11y/transitions': [
      '@react-native-aria/focus',
      '@universa11y/overlay',
      '@universa11y/react-native-aria',
      '@universa11y/utils',
      'react-native-svg',
    ],
    '@universa11y/ui-provider': [
      '@react-native-aria/focus',
      'react-native-svg',
      '@universa11y/utils',
      '@universa11y/toast',
      '@universa11y/react-native-aria',
    ],
    '@universa11y/utils': ['@react-native-aria/focus', 'react-native-svg'],
    '@universa11y/vstack': [
      '@react-native-aria/focus',
      '@universa11y/react-native-aria',
      '@universa11y/utils',
      'react-native-svg',
    ],
  };

  const reactNativeAriaDependencies: any = {
    '@react-native-aria/button': [
      '@react-aria/utils',
      '@react-native-aria/interactions',
      '@react-stately/toggle',
      '@react-types/checkbox',
    ],
    '@react-native-aria/checkbox': [
      '@react-aria/checkbox',
      '@react-aria/utils',
      '@react-native-aria/toggle',
      '@react-native-aria/utils',
      '@react-stately/toggle',
    ],
    '@react-native-aria/combobox': [
      '@react-aria/combobox',
      '@react-aria/live-announcer',
      '@react-aria/overlays',
      '@react-aria/utils',
      '@react-native-aria/utils',
      '@react-types/button',
    ],
    '@react-native-aria/disclosure': [
      '@react-aria/utils',
      '@react-native-aria/utils',
    ],
    '@react-native-aria/focus': ['@react-aria/focus'],
    '@react-native-aria/interactions': [
      '@react-aria/interactions',
      '@react-aria/utils',
      '@react-native-aria/utils',
    ],
    '@react-native-aria/listbox': [
      '@react-aria/interactions',
      '@react-aria/label',
      '@react-aria/listbox',
      '@react-aria/selection',
      '@react-aria/utils',
      '@react-native-aria/interactions',
      '@react-native-aria/utils',
      '@react-types/listbox',
      '@react-types/shared',
    ],
    '@react-native-aria/menu': [
      '@react-aria/interactions',
      '@react-aria/menu',
      '@react-aria/selection',
      '@react-aria/utils',
      '@react-native-aria/interactions',
      '@react-native-aria/overlays',
      '@react-native-aria/utils',
      '@react-stately/collections',
      '@react-stately/menu',
      '@react-stately/tree',
      '@react-types/menu',
    ],
    '@react-native-aria/overlays': [
      '@react-aria/interactions',
      '@react-aria/overlays',
      '@react-native-aria/utils',
      '@react-stately/overlays',
      '@react-types/overlays',
      'dom-helpers',
    ],
    '@react-native-aria/radio': [
      '@react-aria/radio',
      '@react-aria/utils',
      '@react-native-aria/interactions',
      '@react-native-aria/utils',
      '@react-stately/radio',
      '@react-types/radio',
    ],
    'react-native-aria': [
      '@react-native-aria/button',
      '@react-native-aria/checkbox',
      '@react-native-aria/focus',
      '@react-native-aria/interactions',
      '@react-native-aria/menu',
      '@react-native-aria/overlays',
      '@react-native-aria/radio',
      '@react-native-aria/switch',
      '@react-native-aria/toggle',
      '@react-native-aria/utils',
    ],
    '@react-native-aria/separator': {},
    '@react-native-aria/slider': [
      '@react-aria/focus',
      '@react-aria/interactions',
      '@react-aria/label',
      '@react-aria/slider',
      '@react-aria/utils',
      '@react-native-aria/utils',
      '@react-stately/slider',
    ],
    '@react-native-aria/switch': [
      '@react-aria/switch',
      '@react-aria/utils',
      '@react-native-aria/toggle',
      '@react-stately/toggle',
      '@react-types/switch',
    ],
    '@react-native-aria/tabs': [
      '@react-aria/tabs',
      '@react-native-aria/interactions',
      '@react-native-aria/utils',
      '@react-stately/tabs',
      '@react-types/tabs',
      '@react-aria/selection',
    ],
    '@react-native-aria/toggle': [
      '@react-aria/focus',
      '@react-aria/utils',
      '@react-native-aria/interactions',
      '@react-native-aria/utils',
      '@react-stately/toggle',
      '@react-types/checkbox',
    ],
    '@react-native-aria/tooltip': [
      '@react-aria/tooltip',
      '@react-aria/utils',
      '@react-native-aria/interactions',
      '@react-native-aria/utils',
      '@react-stately/tooltip',
    ],
    '@react-native-aria/utils': ['@react-aria/utils', '@react-aria/ssr'],
  };

  let compTranspileModules: any = [];

  if (depMap.has('@universa11y')) {
    depMap.get('@universa11y').map((item: any) => {
      compTranspileModules = [
        ...compTranspileModules,
        item,
        ...universa11yDependencies[item],
      ];
    });
  }
  if (depMap.has('@react-native-aria')) {
    depMap.get('@react-native-aria').map((item: any) => {
      compTranspileModules = [
        ...compTranspileModules,
        item,
        ...reactNativeAriaDependencies[item],
      ];
    });
  }

  let gluestackUITranspileModules = Array.from(
    new Set([
      'react-native-web',
      '@dank-style/react',
      '@dank-style/css-injector',
      '@gluestack/ui-next-adapter',
      ...compTranspileModules,
      ...transpileModules,
    ])
  );

  console.log(gluestackUITranspileModules);

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
