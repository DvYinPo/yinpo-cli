#!/usr/bin/env node

import chalk from 'chalk'
import prompts from 'prompts'
import Choice from './src/Choice';
import generate from './src/generate';
import minimist from "minimist";
import path from 'node:path';
import { isEmptyDir, emptyDir } from './src/utils';

const arg = minimist(process.argv.slice(2))['_'];
let projectName = arg[0]?.trim().replace(/\/+$/g, '');
const cwd = process.cwd();

(async () => {
  const start = await prompts({
    type: 'confirm',
    name: 'ready',
    message: '欢迎使用该脚手架，准备好开始选择项目框架了嘛？',
    initial: true
  })

  if (!start.ready) return false

  let config: prompts.Answers<"name" | "buildTool" | "frame" | "plugins">
  try {
    config = await prompts([{
      type: 'text',
      name: 'name',
      message: '请输入项目名：',
      validate: (name) => {
        if (name.trim().length === 0) {
          return '项目名不能为空';
        }
        projectName = name;
        return true
      }
    },
    {
      name: 'overwrite',
      type: (prev: string) => isEmptyDir(prev) ? null : 'toggle',
      message: (prev: string) => `存在非空目录${prev}, 是否覆盖？`,
      inactive: '否',
      active: '是',
      initial: false,
      onState: (state: any) => {
        if (!state.value) {
          console.error(chalk.bold.red('\n✖'), ' 操作终止！')
          process.exit(1)
        }
      }
    },
    {
      type: 'select',
      name: 'buildTool',
      message: '请选择项目构建工具？',
      choices: [
        Choice.vite(),
        Choice.webpack(),
      ],
      hint: "Choose what you are best at",
    }, {
      type: 'select',
      name: 'frame',
      message: '请选择项目主要框架？',
      choices: [
        Choice.react(),
        Choice.vue(),
      ],
      hint: "Choose what you are best at",
    }, {
      type: 'multiselect',
      name: 'plugins',
      message: '请选择你需要的插件？',
      choices: (prev: string) => {
        const common = [
          Choice.eslint({ selected: true }),
          Choice.axios({ selected: true }),
          Choice.typescript({ selected: true }),
        ]
        const react = [
          Choice.reactRoute({ selected: true }),
          Choice.styledComponents(),
          Choice.redux(),
          Choice.materialUI(),
          Choice.antDesign(),
        ]

        const vue = [
          Choice.vuex(),
          Choice.pinia(),
          Choice.vueRoute({ selected: true }),
          Choice.element(),
          Choice.antDesignVue()
        ]

        if (Choice.react().value === prev) return [...common, ...react]
        if (Choice.vue().value === prev) return [...common, ...vue]

        return []
      },
      hint: "Choose what you are best at",
      }]);
  } catch (error: any) {
    console.log(chalk.red(error.message))
    return
  }

  if (!config.plugins) {
    console.log(chalk.red('\n已终止！！！\n'))
    return
  }

  const isTS = config.plugins.includes(Choice.typescript().value)
  const templateDir = path.resolve(
    __dirname,
    './templates',
    `${config.buildTool}/${config.frame}${isTS ? '-ts' : ''}`,)
  const projectPath = path.join(cwd, projectName)

  emptyDir(projectPath)

  generate(templateDir, projectPath, Object.assign(config, { projectName }))
})();
