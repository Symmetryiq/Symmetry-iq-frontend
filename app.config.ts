import { ConfigContext, ExpoConfig } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => {
  return {
    ...config,
    name: 'Symmetry IQ',
    description: 'A mobile app focused on assisting users ',
    slug: 'symmetry-iq',
    owner: 'symmetry-iq',
    version: '1.0.0',
    platforms: ['ios', 'android'],
    orientation: 'portrait',
    icon: './assets/images/icon.png',
    scheme: 'symmetryiq',
    userInterfaceStyle: 'dark',
    backgroundColor: '#16141f',
    newArchEnabled: true,
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.bergmanmedia.symmetryiq',
      googleServicesFile: './GoogleService-Info.plist',
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
      },
    },
    android: {
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
      package: 'com.bergmanmedia.symmetryiq',
      googleServicesFile: './google-services.json',
    },
    web: {
      output: 'static',
      favicon: './assets/images/favicon.png',
    },
    plugins: [...config.plugins!, './plugins/withMediapipeTasks.js'],
    experiments: {
      typedRoutes: true,
      reactCompiler: true,
    },
    extra: {
      ...config.extra,
      router: {},
      eas: {
        projectId: '51228dab-19a8-4c7f-ac85-cb808412e5a1',
      },
    },
  };
};
