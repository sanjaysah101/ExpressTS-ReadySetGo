#!/usr/bin/env node

import * as fs from 'fs';
import * as path from 'path';
import * as inquirer from 'inquirer';
import chalk from 'chalk';
import { isValidNpmPackageName } from './utils/validation';
import { CURR_DIR } from './utils/config';
import { createDirectoryContents } from './createDirectoryContent';
import { postProcess } from './postProcess';

const CHOICES = fs.readdirSync(path.join(__dirname, 'templates'));
const QUESTIONS = [
  {
    name: 'template',
    type: 'list',
    message: 'What template would you like to use?',
    choices: CHOICES,
  },
  {
    name: 'name',
    type: 'input',
    message: 'Please input a new project name:',
    validate: (input: string) => {
      if (!isValidNpmPackageName(input)) {
        return `Invalid npm package name: "${input}". Please follow the npm naming conventions. 
  For scoped packages: "@scope/name", and for unscoped packages: "name". 
  Names can include lowercase letters, digits, hyphens, underscores, dots, and tildes.`;
      }
      return true;
    },
  },
];

export interface CliOptions {
  projectName: string;
  templateName: string;
  templatePath: string;
  targetPath: string;
}

let options: CliOptions;

inquirer
  .prompt(QUESTIONS)
  .then(async (answers: any) => {
    const projectChoice: string = answers.template;
    const projectName: string = answers.name;
    const templatePath = path.join(__dirname, 'templates', projectChoice);
    const targetPath = path.join(CURR_DIR, projectName);

    if (fs.existsSync(projectName)) throw new Error(`Project with name ${projectName} already exists.`);

    options = {
      projectName,
      templateName: projectChoice,
      templatePath,
      targetPath,
    };

    createProject(targetPath);

    await createDirectoryContents(templatePath, projectName);

    await postProcess(options);
  })
  .catch((err) => {
    console.log(err);
  });

function createProject(projectPath: string): void {
  console.log(chalk.yellowBright('Creating the project..'));
  fs.mkdirSync(projectPath);
}
