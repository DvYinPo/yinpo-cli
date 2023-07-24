import chalk from 'chalk'
import Loading from './Loading.js'
import prompts from 'prompts'
import Choice from './Choice.js';
import generate from './generate.js';
import minimist from "minimist";


const arg = minimist(process.argv.slice(2))['_'];
let projectName = arg[0]?.trim().replace(/\/+$/g, '');

(async () => {
  const start = await prompts({
    type: 'confirm',
    name: 'ready',
    message: '欢迎使用该脚手架，准备好开始选择项目框架了嘛？',
    initial: true
  })

  if (!start.ready) return false

  if (!projectName) {
    const { name } = await prompts({
      type: 'text',
      name: 'name',
      message: '请输入项目名：',
    });
    projectName = name;
  }

  let config: prompts.Answers<"buildTool" | "frame" | "plugins">
  try {
    config = await prompts([{
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

  const end = await prompts({
    type: 'confirm',
    name: 'confirm',
    message: `请确认所选配置：
  构建工具：${config.buildTool}
  项目框架：${config.frame}
  编程语言：${config.plugins.includes(Choice.typescript().value) ? 'typescript' : 'javascript'}
  插件：${config.plugins}\n`,
    initial: true
  })

  if (!end.confirm) {
    Loading("已取消！").fail()
    return false
  }

  generate(Object.assign(config, { projectName }))
})();
