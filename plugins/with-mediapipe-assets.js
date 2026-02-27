const {
  withDangerousMod,
  withXcodeProject,
  IOSConfig,
} = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');
const util = require('util');

const ASSET_FILE_NAME = 'face_landmarker.task';

const withMediapipeAssets = (config, { src, groupName = 'Resources' }) => {
  // ============ ANDROID ============
  config = withDangerousMod(config, [
    'android',
    async (config) => {
      console.log('🔵 [ANDROID] Starting');

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
      console.log(`✅ [ANDROID] Copied ${ASSET_FILE_NAME}`);

      return config;
    },
  ]);

  // ============ iOS - COPY FILE ============
  config = withDangerousMod(config, [
    'ios',
    async (config) => {
      console.log(`🔵 [IOS] Starting`);
      const iosRoot = config.modRequest.platformProjectRoot;
      const srcPath = path.resolve(config.modRequest.projectRoot, src);
      const destPath = path.resolve(iosRoot, path.basename(src));

      if (!fs.existsSync(srcPath))
        throw new Error(`Source file missing: ${srcPath}`);

      fs.copyFileSync(srcPath, destPath);
      console.log(`✅ [IOS] Copied ${ASSET_FILE_NAME}`);

      return config;
    },
  ]);

  config = withXcodeProject(config, (config) => {
    console.log(`🔵 [IOS] Adding to Xcode project`);
    const proj = config.modResults;
    const groupName = 'Resources';

    console.log(
      `Modresults: ${util.inspect(config.modResults, { depth: null, colors: true })}`,
    );

    try {
      const file = IOSConfig.XcodeUtils.addResourceFileToGroup({
        filepath: ASSET_FILE_NAME,
        groupName: groupName,
        project: proj,
        verbose: true,
      });
      console.log(
        `[IOS] File: ${util.inspect(file, { depth: null, colors: true })}`,
      ); // This file returns [object Object], We need to access the basename property

      if (file && file.basename) {
        proj
          .addFileToBuild(
            file.fileRef,
            proj.findBuildPhaseByFile('PBXResourcesBuildPhase', file.fileRef),
          )
          .then(() =>
            console.log(`✅ [IOS] Added ${ASSET_FILE_NAME} to Xcode project`),
          )
          .catch((err) =>
            console.error(
              `❌ [IOS] Failed to add ${ASSET_FILE_NAME} to Xcode project`,
              err,
            ),
          );
      }
    } catch (err) {
      console.error(
        `❌ [IOS] Failed to add ${ASSET_FILE_NAME} to Xcode project`,
        err,
      );
    }

    return config;
  });

  return config;
};

module.exports = withMediapipeAssets;
