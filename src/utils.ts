import fs from 'fs';
import path from 'path';

/**
 * 判断给定目录是否为空
 * @param {string} dir - 目录路径
 * @returns {boolean} 如果目录为空则返回true，否则返回false
 */
export function isEmptyDir(path: string) {
  if (!fs.existsSync(path)) {
    return true
  }

  const files = fs.readdirSync(path)
  return files.length === 0 || (files.length === 1 && files[0] === '.git')
}

export function emptyDir(dir: string) {
  if (!fs.existsSync(dir)) {
    return
  }
  for (const file of fs.readdirSync(dir)) {
    fs.rmSync(path.resolve(dir, file), { recursive: true, force: true })
  }
}

interface nodeType {
  text: string;
  children?: nodeType[];
  inTagAndNeedSkip: boolean;
  hasStart?: boolean;
  hasEnd?: boolean;
  valid: boolean;
}

export function extractTemplate(content: string, key: string, which: boolean): string {
  const startTag = `{%TEMPLATE-START-${key}%}`;
  const elseTag = `{%TEMPLATE-ELSE-${key}%}`;
  const endTag = `{%TEMPLATE-END-${key}%}`;

  const hasStartTag = ~content.indexOf(startTag)
  const hasEndTag = ~content.indexOf(endTag)

  if ((!hasStartTag && !hasEndTag)) return content

  const stack: nodeType[] = [];
  let currentNode: nodeType = {
    text: "",
    inTagAndNeedSkip: false,
    valid: true,
  };
  let i = 0;
  while (i < content.length) {
    if (content.slice(i, i + startTag.length) === startTag) {
      const newNode = { text: "", valid: false, hasStart: true, inTagAndNeedSkip: !which };
      stack.push(currentNode);
      currentNode = newNode;
      i += startTag.length;
    } else if (content.slice(i, i + elseTag.length) === elseTag) {
      currentNode.inTagAndNeedSkip = which
      i += elseTag.length;
    } else if (content.slice(i, i + endTag.length) === endTag) {
      currentNode.hasEnd = currentNode.hasStart;
      currentNode.valid = Boolean(currentNode.hasStart && currentNode.hasEnd);

      if (!currentNode.valid) {
        new Error(`模板内容非法，请注意模板格式：\n\n${startTag} xxx ${elseTag} xxx ${endTag}\n`)
      }

      const prev = stack.pop()
      if (!prev) {
        new Error(`模板内容非法，请注意模板格式：\n\n${startTag} xxx ${elseTag} xxx ${endTag}\n`)
        return ''
      }
      if (!prev.inTagAndNeedSkip) prev.text += currentNode.text
      currentNode = prev
      i += endTag.length;
    } else {
      if (!currentNode.inTagAndNeedSkip) currentNode.text += content[i];
      i++;
    }
  }

  return currentNode.text;
}

export function resolveTemplateByConfig(templateData: string, config: {[key: string]: boolean}) {
  return Object.keys(config).reduce((res, key) => {
    return extractTemplate(res, key, config[key])
  }, templateData)
}

export const write = (file: string, content: string) => {
  fs.writeFileSync(file, content)
}

export function editFile(file: string, callback: (content: string) => string) {
  const content = fs.readFileSync(file, 'utf-8')
  fs.writeFileSync(file, callback(content), 'utf-8')
}

export function setupReactSwc(root: string, isTs: boolean) {
  editFile(path.resolve(root, 'package.json'), (content) => {
    return content.replace(
      /"@vitejs\/plugin-react": ".+?"/,
      `"@vitejs/plugin-react-swc": "^3.0.0"`,
    )
  })
  editFile(
    path.resolve(root, `vite.config.${isTs ? 'ts' : 'js'}`),
    (content) => {
      return content.replace('@vitejs/plugin-react', '@vitejs/plugin-react-swc')
    },
  )
}
