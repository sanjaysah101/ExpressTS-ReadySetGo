import * as fs from 'fs';
import * as path from 'path';
import * as template from './utils/template';
import { CURR_DIR, SKIP_FILES } from './utils/config';

export async function createDirectoryContents(templatePath: string, projectName: string): Promise<void> {
  const filesToCreate = await fs.promises.readdir(templatePath);

  await Promise.all(
    filesToCreate.map(async (file: string) => {
      const origFilePath = path.join(templatePath, file);
      const stats = await fs.promises.stat(origFilePath);

      if (SKIP_FILES.includes(file)) return;

      if (stats.isFile()) {
        const writePath = path.join(CURR_DIR, projectName, file);
        await fs.promises.writeFile(
          writePath,
          (await template.render(await fs.promises.readFile(origFilePath, 'utf8'), { projectName })) as string,
          'utf8',
        );
      } else if (stats.isDirectory()) {
        const destDir = path.join(CURR_DIR, projectName, file);
        await fs.promises.mkdir(destDir, { recursive: true });
        await createDirectoryContents(origFilePath, path.join(projectName, file));
      }
    }),
  );
}
