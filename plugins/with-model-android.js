const { withDangerousMod } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

const ASSET_FILE_NAME = 'face_landmarker.task';

module.exports = (config) => {
  return withDangerousMod(config, [
    'android',
    async (config) => {
      const projectRoot = config.modRequest.projectRoot;
      const sourceFile = path.join(projectRoot, 'assets', ASSET_FILE_NAME);
      const targetDir = path.join(projectRoot, 'android/app/src/main/assets');

      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }

      if (!fs.existsSync(sourceFile)) {
        throw new Error(`Source file not found: ${sourceFile}`);
      }

      fs.copyFileSync(sourceFile, path.join(targetDir, ASSET_FILE_NAME));

      return config;
    },
  ]);
};
