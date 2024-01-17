import path from "path";
import Choice from "./Choice";
import Loading from "./Loading";
import fs from "fs";
import chalk from "chalk";
import { isEmptyDir, resolveTemplateByConfig } from "./utils";

interface configType {
  buildTool: string;
  frame: string;
  plugins: string[];
  projectName: string;
}

const generate = (templateDir: string, target: string, config: configType) => {
  const l = Loading("正在生成项目框架...")
  const projectName = config.projectName

  const configMap = Object.keys(Choice).reduce((acc, item) => {
    acc[item] = config.plugins.includes(item)
    return acc
  }, {} as {[key: string]: boolean})

  const copyFolder = (sourcePath: string, destinationPath: string) => {
    fs.mkdirSync(destinationPath, { recursive: true });
    // 读取源文件夹中的所有文件和子文件夹
    const files = fs.readdirSync(sourcePath);

    // 遍历每个文件和子文件夹
    files.forEach(async (file) => {
      // 构建文件/文件夹的完整路径
      const filePath = path.join(sourcePath, file);
      const destinationFilePath = path.join(destinationPath, file);

      // 判断是否为文件夹
      if (fs.statSync(filePath).isDirectory()) {
        // 如果是文件夹，则递归调用copyFolder()函数
        copyFolder(filePath, destinationFilePath);
      } else {
        // 如果是文件，则直接复制文件内容
        const fileData = fs.readFileSync(filePath, 'utf-8');
        if (file.endsWith('.template')) {
          const result = resolveTemplateByConfig(fileData, configMap)
          const path = destinationFilePath.replace(/\.template$/, '')
          if (result.trim()) fs.writeFileSync(path, result.trim(), 'utf-8');
        } else {
          fs.writeFileSync(destinationFilePath, fileData, 'utf-8');
        }
      }
    });

    if (isEmptyDir(destinationPath)) fs.rmSync(destinationPath, { recursive: true, force: true });
  }

  copyFolder(templateDir, target)

  const succeedText = `\n
    项目生成成功！运行以下指令：
      ${chalk.blue(`
      cd ${projectName}
      npm install
      npm run dev`)}
    \n`;
  l.succeed()
  console.log(succeedText);
  return true
}

export default generate;
