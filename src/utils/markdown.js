import markdownIt from 'markdown-it'

// 创建 Markdown 渲染器
const md = markdownIt()

// 格式化 Markdown 消息
export function formatMessage(content) {
  return md.render(content) // 使用 markdown-it 进行 Markdown 渲染
}