import * as fs from 'fs/promises';
import * as path from 'path';
import * as shell from 'shelljs';
import chalk from 'chalk';

import { type CliOptions } from './interfaces';

export const postProcess = async (options: CliOptions): Promise<boolean> => {
  const isNode = await fs
    .access(path.join(options.templatePath, 'package.json'))
    .then(() => true)
    .catch(() => false);

  if (isNode) {
    shell.cd(options.targetPath);
    const gitInit = shell.exec('git init');
    if (gitInit.code !== 0) {
      console.log(chalk.redBright('Failed to initialize git'));
      return false;
    }

    console.log(chalk.blueBright('Installing packages...'));
    const result = shell.exec('yarn');
    if (result.code !== 0) {
      console.log(chalk.redBright('Failed to install packages'));
      return false;
    }

    shell.exec('git add .');
    shell.exec('git commit -m "Initial commit"');
  }

  console.log(chalk.greenBright('Project successfully created!'));
  return true;
};
