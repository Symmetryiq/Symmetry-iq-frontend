const { withDangerousMod } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

const TASK_DIR = 'assets/mediapipe';

module.exports = function withMediapipeTasks(config) {
  // ANDROID
  config = withDangerousMod(config, [
    'android',
    async (config) => {
      if (config.modRequest.introspect) {
        return config;
      }

      const projectRoot = config.modRequest.projectRoot;
      const androidRoot = config.modRequest.platformProjectRoot;

      const srcDir = path.join(projectRoot, TASK_DIR);
      const destDir = path.join(androidRoot, 'app/src/main/assets/mediapipe');

      if (!fs.existsSync(srcDir)) {
        console.warn('⚠️ No mediapipe task assets found (Android)');
        return config;
      }

      fs.mkdirSync(destDir, { recursive: true });
      fs.cpSync(srcDir, destDir, { recursive: true });

      console.log('✅ MediaPipe tasks copied to Android assets');
      return config;
    },
  ]);

  // IOS
  config = withDangerousMod(config, [
    'ios',
    async (config) => {
      if (config.modRequest.introspect) {
        return config;
      }

      const projectRoot = config.modRequest.projectRoot;
      const iosRoot = config.modRequest.platformProjectRoot;
      const projectName = config.modRequest.projectName;

      const srcDir = path.join(projectRoot, TASK_DIR);
      const destDir = path.join(iosRoot, projectName, 'mediapipe');

      if (!fs.existsSync(srcDir)) {
        console.warn('⚠️ No mediapipe task assets found (iOS)');
        return config;
      }

      fs.mkdirSync(destDir, { recursive: true });
      fs.cpSync(srcDir, destDir, { recursive: true });

      console.log('✅ MediaPipe tasks copied to iOS bundle');
      return config;
    },
  ]);

  return config;
};
