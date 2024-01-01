import * as fs from 'fs';
import * as path from 'path';
import * as shell from 'shelljs';
import chalk from 'chalk';

import { type CliOptions } from './interfaces';

export const postProcess = (options: CliOptions): void => {
  const isNode = fs.existsSync(path.join(options.templatePath, 'package.json'));
  if (isNode) {
    shell.cd(options.targetPath);
    const gitInit = shell.exec('git init');
    if (gitInit.code !== 0) {
      throw new Error('Failed to initialize git');
    }

    const result = shell.exec('yarn');
    console.log(chalk.blueBright('installing packages'));
    if (result.code !== 0) {
      throw new Error('Failed to install packages');
    }
    console.log(chalk.greenBright('all packages installed'));

    const gitAdd = shell.exec('git add .');
    if (gitAdd.code !== 0) {
      throw new Error('Failed to stage git');
    }

    const gitCommit = shell.exec('git commit -m "initial commit"');
    if (gitCommit.code !== 0) {
      throw new Error('Failed to commit');
    }
  }

  console.log(chalk.greenBright('Project successfully created'));
};
