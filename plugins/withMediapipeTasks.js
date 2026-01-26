const { withDangerousMod, withXcodeProject } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

const TASK_DIR = 'assets/mediapipe';

module.exports = function withMediapipeTasks(config) {
  // 1. ANDROID: (Keep as is, since it's working)
  config = withDangerousMod(config, [
    'android',
    async (config) => {
      const projectRoot = config.modRequest.projectRoot;
      const androidRoot = config.modRequest.platformProjectRoot;
      const srcDir = path.join(projectRoot, TASK_DIR);
      const destDir = path.join(androidRoot, 'app/src/main/assets/mediapipe');

      if (fs.existsSync(srcDir)) {
        fs.mkdirSync(destDir, { recursive: true });
        fs.cpSync(srcDir, destDir, { recursive: true });
      }
      return config;
    },
  ]);

  // 2. iOS: Copy the physical files
  config = withDangerousMod(config, [
    'ios',
    async (config) => {
      const projectRoot = config.modRequest.projectRoot;
      const iosRoot = config.modRequest.platformProjectRoot;
      const srcDir = path.join(projectRoot, TASK_DIR);
      const destDir = path.join(iosRoot, 'mediapipe'); // Copy to root of iOS project

      if (fs.existsSync(srcDir)) {
        fs.mkdirSync(destDir, { recursive: true });
        fs.cpSync(srcDir, destDir, { recursive: true });
      }
      return config;
    },
  ]);

  // 3. iOS: Link files to the Xcode Project (The missing piece)
  config = withXcodeProject(config, (config) => {
    const xcodeProject = config.modResults;
    const groupName = 'mediapipe';

    // This adds the folder to the Xcode project structure
    xcodeProject.addResourceFile(groupName, {
      target: xcodeProject.getFirstTarget().uuid,
    });

    return config;
  });

  return config;
};
