const { withDangerousMod, withXcodeProject } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

const TASK_DIR = 'assets/mediapipe';
const MODEL_FILE = 'face_landmarker.task';

module.exports = function withMediapipeTasks(config) {
  // ANDROID (Keep your working logic)
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

  // IOS: 1. Copy the file
  config = withDangerousMod(config, [
    'ios',
    async (config) => {
      const projectRoot = config.modRequest.projectRoot;
      const iosRoot = config.modRequest.platformProjectRoot;

      const srcFile = path.join(projectRoot, TASK_DIR, MODEL_FILE);
      const destDir = path.join(iosRoot, 'mediapipe');
      const destFile = path.join(destDir, MODEL_FILE);

      if (fs.existsSync(srcFile)) {
        fs.mkdirSync(destDir, { recursive: true });
        fs.copyFileSync(srcFile, destFile);
        console.log(`✅ Copied ${MODEL_FILE} to iOS native directory`);
      }
      return config;
    },
  ]);

  // IOS: 2. Link the file to Xcode safely
  config = withXcodeProject(config, (config) => {
    const xcodeProject = config.modResults;
    const targetUuid = xcodeProject.getFirstTarget().uuid;
    const groupName = 'Resources'; // Standard Xcode group

    // We use the path relative to the 'ios' directory
    const filePath = `mediapipe/${MODEL_FILE}`;

    // Check if it's already added to avoid duplicates
    if (!xcodeProject.hasFile(filePath)) {
      xcodeProject.addResourceFile(filePath, { target: targetUuid }, groupName);
      console.log(`✅ Linked ${MODEL_FILE} to Xcode project`);
    }

    return config;
  });

  return config;
};
