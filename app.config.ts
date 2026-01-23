import { ConfigContext, ExpoConfig } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => {
  return {
    name: 'Symmetry IQ',
    description: 'A mobile app focused on assisting users',
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
      ...config.ios,
      supportsTablet: true,
      bundleIdentifier: 'com.bergmanmedia.symmetryiq',
      googleServicesFile: './GoogleService-Info.plist',
      infoPlist: {
        ...config.ios?.infoPlist,
        ITSAppUsesNonExemptEncryption: false,
      },
    },

    android: {
      ...config.android,
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
      package: 'com.bergmanmedia.symmetryiq',
      googleServicesFile: './google-services.json',
    },

    web: {
      ...config.web,
      output: 'static',
      favicon: './assets/images/favicon.png',
    },

    plugins: [
      ...(config.plugins || []),
      'expo-router',
      [
        'expo-font',
        {
          fonts: [
            'node_modules/@expo-google-fonts/outfit/400Regular/Outfit_400Regular.ttf',
            'node_modules/@expo-google-fonts/outfit/500Medium/Outfit_500Medium.ttf',
            'node_modules/@expo-google-fonts/outfit/600SemiBold/Outfit_600SemiBold.ttf',
            'node_modules/@expo-google-fonts/outfit/700Bold/Outfit_700Bold.ttf',
          ],
        },
      ],
      [
        'expo-splash-screen',
        {
          image: './assets/images/icon.png',
          imageWidth: 200,
          resizeMode: 'contain',
          backgroundColor: '#ffffff',
          dark: {
            backgroundColor: '#16141f',
          },
        },
      ],
      [
        'expo-image-picker',
        {
          photosPermission:
            'The app accesses your photos to analyze your face and generate routines.',
          cameraPermission:
            'The app accesses your camera to capture pictures and help you improve your face.',
        },
      ],
      [
        'expo-build-properties',
        {
          ios: {
            useFrameworks: 'static',
            forceStaticLinking: ['VisionCamera', 'react-native-worklets-core'],
          },
        },
      ],
      'expo-secure-store',
      './plugins/withMediapipeTasks.js',
    ],

    experiments: {
      ...config.experiments,
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
