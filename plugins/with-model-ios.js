const { withXcodeProject } = require('@expo/config-plugins');
const path = require('path');
const fs = require('fs');

module.exports = (config) => {
  return withXcodeProject(config, (config) => {
    const { projectRoot, platformProjectRoot } = config.modRequest;
    const xcodeProject = config.modResults;
    const modelFileName = 'face_landmarker.task';
    const modelSourcePath = path.resolve(projectRoot, 'assets', modelFileName);
    const destPath = path.join(platformProjectRoot, modelFileName);

    // 1. Copy the file (You've confirmed this part works)
    if (!fs.existsSync(modelSourcePath)) {
      console.error(`[IOS] Source model not found: ${modelSourcePath}`);
      return config;
    }
    fs.copyFileSync(modelSourcePath, destPath);

    try {
      // 2. Fix the "null reading path" error
      // We check if a 'Resources' group exists. If not, we create it.
      const groupName = 'Resources';
      let pbxGroup = xcodeProject.pbxGroupByName(groupName);

      if (!pbxGroup) {
        // Create the group if it's missing (this is what stops the crash)
        const rootGuid =
          xcodeProject.pbxProjectSection()[
            xcodeProject.getFirstProject()['uuid']
          ]['mainGroup'];
        xcodeProject.addPbxGroup([], groupName, groupName);
        console.log(`[IOS] Created missing 'Resources' group in Xcode.`);
      }

      // 3. Add the resource file to that group
      // Using the more explicit addResourceFile call
      xcodeProject.addResourceFile(modelFileName, {
        target: xcodeProject.getFirstTarget().uuid,
      });

      console.log(`[IOS] Successfully linked ${modelFileName} to Xcode.`);
    } catch (error) {
      console.error(`[IOS] Fatality: ${error.stack}`);
    }

    return config;
  });
};
