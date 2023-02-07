export default function withGluestackUI({ transpileModules, nextConfig }: any) {
  console.log('hello');
  let gluestackUITranspileModules = Array.from(
    new Set([
      'react-native-web',
      'react-native-aria',

      '@dank-style/react',
      '@dank-style/css-injector',

      '@gluestack/ui-next-adapter',

      '@universa11y/button',
      '@universa11y/actionsheet',
      '@universa11y/alert-dialog',
      '@universa11y/avatar',
      '@universa11y/blank',
      '@universa11y/checkbox',
      '@universa11y/divider',
      '@universa11y/fab',
      '@universa11y/floating-ui',
      '@universa11y/form-control',
      '@universa11y/hooks',
      '@universa11y/hstack',
      '@universa11y/icon',
      '@universa11y/icon-button',
      '@universa11y/input',
      '@universa11y/link',
      '@universa11y/menu',
      '@universa11y/modal',
      '@universa11y/overlay',
      '@universa11y/popover',
      '@universa11y/popper',
      '@universa11y/pressable',
      '@universa11y/progress',
      '@universa11y/provider',
      '@universa11y/radio',
      '@universa11y/react-native-aria',
      '@universa11y/select',
      '@universa11y/slider',
      '@universa11y/spinner',
      '@universa11y/stack',
      '@universa11y/switch',
      '@universa11y/tabs',
      '@universa11y/textarea',
      '@universa11y/toast',
      '@universa11y/tooltip',
      '@universa11y/transitions',
      '@universa11y/ui-provider',
      '@universa11y/utils',
      '@universa11y/vstack',

      '@react-native-aria/button',
      '@react-native-aria/checkbox',
      '@react-native-aria/combobox',
      '@react-native-aria/disclosure',
      '@react-native-aria/focus',
      '@react-native-aria/interactions',
      '@react-native-aria/listbox',
      '@react-native-aria/menu',
      '@react-native-aria/overlays',
      '@react-native-aria/radio',
      '@react-native-aria/separator',
      '@react-native-aria/slider',
      '@react-native-aria/switch',
      '@react-native-aria/tabs',
      '@react-native-aria/toggle',
      '@react-native-aria/tooltip',
      '@react-native-aria/utils',
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
