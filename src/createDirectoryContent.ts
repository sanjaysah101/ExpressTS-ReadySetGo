import * as fs from 'fs';
import * as path from 'path';

import * as template from './utils/template';
import { CURR_DIR, SKIP_FILES } from './utils/config';

export const createDirectoryContents = (templatePath: string, projectName: string): void => {
  const filesToCreate = fs.readdirSync(templatePath);

  filesToCreate.forEach((file) => {
    const origFilePath = path.join(templatePath, file);
    const stats = fs.statSync(origFilePath);

    if (shouldSkipFile(file)) return;

    if (stats.isFile()) {
      processFile(origFilePath, file, projectName);
    } else if (stats.isDirectory()) {
      processDirectory(origFilePath, file, projectName);
    }
  });
};

const shouldSkipFile = (file: string): boolean => {
  return SKIP_FILES.includes(file);
};

const processFile = (origFilePath: string, fileName: string, projectName: string): void => {
  const contents = transformFileContents(origFilePath, projectName);
  const writePath = path.join(CURR_DIR, projectName, fileName);

  fs.writeFileSync(writePath, contents, 'utf8');
};

const transformFileContents = (filePath: string, projectName: string): string => {
  const contents = fs.readFileSync(filePath, 'utf8');
  return template.render(contents, { projectName });
};

const processDirectory = (origDirPath: string, dirName: string, projectName: string): void => {
  const targetDir = path.join(CURR_DIR, projectName, dirName);

  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir);
  }

  createDirectoryContents(origDirPath, path.join(projectName, dirName));
};
