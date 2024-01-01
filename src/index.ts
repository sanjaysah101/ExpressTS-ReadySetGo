#!/usr/bin/env node

import * as fs from 'fs';
import * as path from 'path';
import * as inquirer from 'inquirer';
import chalk from 'chalk';
import * as template from './utils/template';
import * as shell from 'shelljs';

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
  },
];

export interface CliOptions {
  projectName: string;
  templateName: string;
  templatePath: string;
  targetPath: string;
}

const CURR_DIR = process.cwd();

let options: CliOptions;

function isValidNpmPackageName(projectName: string): boolean {
  const pattern = /^(?:(?:@(?:[a-z0-9-*~][a-z0-9-*._~]*)?\/[a-z0-9-._~])|[a-z0-9-~])[a-z0-9-._~]*$/;
  return pattern.test(projectName);
}

inquirer
  .prompt(QUESTIONS)
  .then((answers: any) => {
    const projectChoice: string = answers.template;
    const projectName: string = answers.name;
    const templatePath = path.join(__dirname, 'templates', projectChoice);
    const targetPath = path.join(CURR_DIR, projectName);

    if (!isValidNpmPackageName(projectName)) throw new Error(`Invalid project name: ${projectName}`);

    if (fs.existsSync(projectName)) throw new Error(`Project with name ${projectName} already exists.`);

    options = {
      projectName,
      templateName: projectChoice,
      templatePath,
      targetPath,
    };

    createProject(targetPath);

    createDirectoryContents(templatePath, projectName);

    postProcess(options);
  })
  .catch((err) => {
    console.log(err);
  });

function createProject(projectPath: string): void {
  console.log(chalk.yellowBright('Creating the project..'));
  fs.mkdirSync(projectPath);
}

const SKIP_FILES = ['node_modules', '.template.json'];

function createDirectoryContents(templatePath: string, projectName: string): void {
  // read all files/folders (1 level) from template folder
  const filesToCreate = fs.readdirSync(templatePath);
  // loop each file/folder
  filesToCreate.forEach((file) => {
    const origFilePath = path.join(templatePath, file);

    // get stats about the current file
    const stats = fs.statSync(origFilePath);

    // skip files that should not be copied
    if (SKIP_FILES.includes(file)) return;

    if (stats.isFile()) {
      // read file content and transform it using template engine
      let contents = fs.readFileSync(origFilePath, 'utf8');
      contents = template.render(contents, { projectName });
      // write file to destination folder
      const writePath = path.join(CURR_DIR, projectName, file);
      fs.writeFileSync(writePath, contents, 'utf8');
    } else if (stats.isDirectory()) {
      if (!fs.existsSync(path.join(CURR_DIR, projectName, file))) {
        // create folder in destination folder
        fs.mkdirSync(path.join(CURR_DIR, projectName, file));
      }
      // copy files/folder inside current folder recursively
      createDirectoryContents(path.join(templatePath, file), path.join(projectName, file));
    }
  });
}

function postProcess(options: CliOptions): boolean {
  const isNode = fs.existsSync(path.join(options.templatePath, 'package.json'));
  if (isNode) {
    shell.cd(options.targetPath);
    const gitInit = shell.exec('git init');
    if (gitInit.code !== 0) {
      console.log(chalk.redBright('Failed to initialize git'));
      return false;
    }

    const result = shell.exec('yarn');
    console.log(chalk.blueBright('installing packages'));
    if (result.code !== 0) {
      console.log(chalk.redBright('Failed to install packages'));
      return false;
    }

    shell.exec('git add .');
    shell.exec('git commit -m "initial commit"');
  }

  console.log(chalk.greenBright('Project successfully created'));

  return true;
}
