import http from 'http'
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import _ from 'lodash'

// 获取当前文件路径和目录
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const localesDir = __dirname
const htmlTemplatePath = path.join(__dirname, 'language-admin.html')

// 配置服务器
const PORT = 3000

/**
 * 提取TypeScript文件中的JSON对象
 * @param {string} fileContent - TypeScript文件内容
 * @returns {Object} - 解析后的JSON对象
 */
function extractJsonFromTs(fileContent) {
  try {
    // 使用正则表达式提取export default后面的JSON对象
    const match = fileContent.match(/export\s+default\s+([\s\S]+);?\s*$/)
    if (match && match[1]) {
      // 去掉可能的分号
      const jsonStr = match[1].replace(/;\s*$/, '')
      // 使用Function构造函数安全地解析JSON对象
      // 这比eval更安全，因为它在隔离的作用域中执行
      const parseFn = new Function('return ' + jsonStr)
      return parseFn()
    }
    return {}
  } catch (error) {
    console.error('提取JSON失败:', error)
    return {}
  }
}

/**
 * 将JSON对象转换回TypeScript格式
 * @param {Object} jsonObj - JSON对象
 * @returns {string} - TypeScript格式的字符串
 */
function jsonToTs(jsonObj) {
  const jsonString = JSON.stringify(jsonObj, null, 2)
  return `export default ${jsonString};
`
}

/**
 * 读取所有语言文件
 * @returns {Promise<Object>} - 语言文件内容对象
 */
async function readAllLanguageFiles() {
  try {
    const files = await fs.readdir(localesDir)
    const languageFiles = files.filter((file) => file.endsWith('.ts') && file !== 'index.ts')

    const languageData = {}

    for (const file of languageFiles) {
      const filePath = path.join(localesDir, file)
      try {
        // 读取文件内容而不是使用import
        const content = await fs.readFile(filePath, 'utf8')
        const langCode = file.replace('.ts', '')

        languageData[langCode] = {
          content: extractJsonFromTs(content),
          originalContent: content,
        }
      } catch (error) {
        console.error(`读取文件 ${filePath} 失败:`, error)
        languageData[file.replace('.ts', '')] = {
          content: {},
          originalContent: '',
          error: error.message,
        }
      }
    }

    return languageData
  } catch (error) {
    console.error('读取语言文件失败:', error)
    return {}
  }
}

/**
 * 获取所有语言代码
 * @returns {Promise<Array<string>>} - 语言代码数组
 */
async function getAllLanguageCodes() {
  try {
    const files = await fs.readdir(localesDir)
    return files
      .filter((file) => file.endsWith('.ts') && file !== 'index.ts')
      .map((file) => file.replace('.ts', ''))
  } catch (error) {
    console.error('获取语言代码失败:', error)
    return []
  }
}

/**
 * 解析表单数据（支持multipart/form-data和application/x-www-form-urlencoded）
 * @param {Buffer} buffer - 请求体缓冲区
 * @returns {Object} - 解析后的表单数据
 */
function parseFormData(buffer) {
  const formData = {}
  const dataString = buffer.toString('utf8')

  // 检查是否是multipart/form-data格式
  if (dataString.includes('------WebKitFormBoundary')) {
    // 提取boundary
    const boundaryMatch = dataString.match(/^------WebKitFormBoundary[\w]+/)
    if (boundaryMatch) {
      const boundary = boundaryMatch[0]

      // 分割数据部分，过滤掉空字符串和结束分隔符
      const parts = dataString
        .split(boundary)
        .filter((part) => part.trim().length > 0 && !part.includes('--'))

      parts.forEach((part) => {
        // 提取Content-Disposition头中的name
        const nameMatch = part.match(/name="([^"]+)"/)
        if (nameMatch) {
          const name = nameMatch[1]
          // 提取值（去除头信息和前后空白）
          const value = part.split('\r\n\r\n')[1]?.trim() || ''

          // 特殊处理：如果是editLanguages字段并且包含逗号，转换为数组
          if (name === 'editLanguages' && value.includes(',')) {
            formData[name] = value.split(',').map((lang) => lang.trim())
          }
          // 特殊处理：如果是newValue字段并且看起来像JSON，尝试解析
          else if (name === 'newValue' && (value.startsWith('{') || value.startsWith('['))) {
            try {
              // 尝试直接解析原始值
              formData[name] = JSON.parse(value)
            } catch (e) {
              try {
                // 尝试修复常见的JSON格式问题
                let fixedValue = value

                // 移除末尾的逗号
                fixedValue = fixedValue.replace(/,\s*$/, '')

                // 检查括号是否匹配
                const openBrackets = (fixedValue.match(/\{/g) || []).length
                const closeBrackets = (fixedValue.match(/\}/g) || []).length
                const bracketDiff = openBrackets - closeBrackets

                // 如果缺少右括号，添加相应数量的右括号
                if (bracketDiff > 0 && fixedValue.startsWith('{')) {
                  fixedValue += '}'.repeat(bracketDiff)
                }

                // 再次尝试解析修复后的值
                formData[name] = JSON.parse(fixedValue)
              } catch (e2) {
                // 如果两次解析都失败，记录详细错误信息
                console.warn(
                  '无法解析newValue为JSON，保留原始字符串:',
                  e.message,
                  '\n尝试修复后仍失败:',
                  e2.message,
                )
                formData[name] = value
              }
            }
          }
          // 普通字段处理
          else {
            formData[name] = value
          }
        }
      })
    }
  }
  // 处理传统的application/x-www-form-urlencoded格式
  else if (dataString.includes('=')) {
    const pairs = dataString.split('&')

    pairs.forEach((pair) => {
      const [key, value] = pair.split('=').map(decodeURIComponent)
      if (key.endsWith('[]')) {
        const arrayKey = key.replace('[]', '')
        if (!formData[arrayKey]) formData[arrayKey] = []
        formData[arrayKey].push(value)
      } else {
        formData[key] = value
      }
    })
  }

  return formData
}

/**
 * 生成语言选择HTML
 * @param {Array<string>} languageCodes - 语言代码数组
 * @param {string} name - 表单字段名称
 * @returns {string} - HTML字符串
 */
function generateLanguageOptions(languageCodes, name) {
  return languageCodes
    .map(
      (code) => `
    <div class="language-item" data-code="${code}">
      <input type="checkbox" id="${name}-${code}" name="${name}" value="${code}" checked>
      <label for="${name}-${code}">${code}</label>
    </div>
  `,
    )
    .join('')
}

/**
 * 生成字段选项HTML
 * @param {Array<string>} keys - 字段键数组
 * @returns {string} - HTML字符串
 */
function generateFieldOptions(keys) {
  return keys.map((key) => `<option value="${key}">${key}</option>`).join('')
}

/**
 * 生成字段列表HTML
 * @param {Array<string>} keys - 字段键数组
 * @returns {string} - HTML字符串
 */
function generateKeyList(keys) {
  const displayKeys = keys.slice(0, 50)
  const listHtml = displayKeys
    .map(
      (key) => `
    <div class="key-item">
      <span class="key-name">${key}</span>
    </div>
  `,
    )
    .join('')

  const moreText = keys.length > 50 ? `<p>... 仅显示前50个字段，共 ${keys.length} 个字段</p>` : ''
  return listHtml + moreText
}

/**
 * 渲染消息HTML
 * @param {string} message - 消息内容
 * @param {string} type - 消息类型
 * @returns {string} - HTML字符串
 */
function generateMessageHtml(message, type = 'info') {
  return message ? `<div class="message ${type}">${message}</div>` : ''
}

/**
 * 替换HTML模板中的内容
 * @param {string} template - HTML模板
 * @param {Object} data - 替换数据
 * @returns {string} - 处理后的HTML
 */
async function processHtmlTemplate(template, data = {}) {
  const { languageCodes = [], existingKeys = [], message = '', messageType = 'info' } = data

  // 生成动态内容
  const messageHtml = generateMessageHtml(message, messageType)
  const languageOptions = generateLanguageOptions(languageCodes, 'languages')
  const editLanguageOptions = generateLanguageOptions(languageCodes, 'editLanguages')
  const fieldOptions = generateFieldOptions(existingKeys)
  const keyListHtml = generateKeyList(existingKeys)

  // 替换模板中的标记
  let result = template
    .replace('<div id="messageContainer"></div>', `<div id="messageContainer">${messageHtml}</div>`)
    .replace(
      '<div id="languageGrid" class="language-grid">',
      `<div id="languageGrid" class="language-grid">${languageOptions}`,
    )
    .replace(
      '<div id="editLanguageGrid" class="language-grid">',
      `<div id="editLanguageGrid" class="language-grid">${editLanguageOptions}`,
    )
    .replace(
      '<select id="editFieldKey" name="editFieldKey" required>',
      `<select id="editFieldKey" name="editFieldKey" required>${fieldOptions}`,
    )
    .replace('<div id="keyList">', `<div id="keyList">${keyListHtml}`)

  return result
}

/**
 * 创建服务器并处理请求
 */
const server = http.createServer(async (req, res) => {
  try {
    // 读取HTML模板
    let htmlTemplate
    try {
      htmlTemplate = await fs.readFile(htmlTemplatePath, 'utf8')
    } catch (error) {
      console.error('读取HTML模板失败:', error)
      res.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8' })
      res.end('<h1>服务器内部错误：无法读取HTML模板文件</h1>')
      return
    }

    // 首页
    if (req.url === '/' && req.method === 'GET') {
      const languageCodes = await getAllLanguageCodes()
      const languageData = await readAllLanguageFiles()

      // 获取所有唯一的字段键
      const allKeys = new Set()
      Object.values(languageData).forEach((lang) => {
        if (lang.content && typeof lang.content === 'object') {
          Object.keys(lang.content).forEach((key) => allKeys.add(key))
        }
      })

      const processedHtml = await processHtmlTemplate(htmlTemplate, {
        languageCodes,
        existingKeys: Array.from(allKeys).sort(),
      })

      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
      res.end(processedHtml)
      return
    }

    // 添加字段
    if (req.url === '/add-field' && req.method === 'POST') {
      let body = []
      req
        .on('data', (chunk) => {
          body.push(chunk)
        })
        .on('end', async () => {
          try {
            const formData = parseFormData(Buffer.concat(body))
            const { fieldKey, defaultValue, languages } = formData

            if (!fieldKey || !defaultValue) {
              const languageCodes = await getAllLanguageCodes()
              const languageData = await readAllLanguageFiles()

              const allKeys = new Set()
              Object.values(languageData).forEach((lang) => {
                if (lang.content && typeof lang.content === 'object') {
                  Object.keys(lang.content).forEach((key) => allKeys.add(key))
                }
              })

              const processedHtml = await processHtmlTemplate(htmlTemplate, {
                languageCodes,
                existingKeys: Array.from(allKeys).sort(),
                message: '字段键名和默认值不能为空',
                messageType: 'error',
              })

              res.writeHead(400, { 'Content-Type': 'text/html; charset=utf-8' })
              res.end(processedHtml)
              return
            }

            const selectedLanguages = Array.isArray(languages) ? languages : languages.split(',')
            let successCount = 0

            for (const langCode of selectedLanguages) {
              const filePath = path.join(localesDir, `${langCode}.ts`)
              try {
                const content = await fs.readFile(filePath, 'utf8')
                const langData = extractJsonFromTs(content)

                // 如果是英语，使用默认值；其他语言可以保持为空或使用默认值
                const value = langCode === 'en' ? defaultValue : defaultValue
                langData[fieldKey] = value

                await fs.writeFile(filePath, jsonToTs(langData), 'utf8')
                successCount++
              } catch (error) {
                console.error(`更新语言 ${langCode} 失败:`, error)
              }
            }

            const languageCodes = await getAllLanguageCodes()
            const languageData = await readAllLanguageFiles()

            // 获取所有唯一的字段键
            const allKeys = new Set()
            Object.values(languageData).forEach((lang) => {
              if (lang.content && typeof lang.content === 'object') {
                Object.keys(lang.content).forEach((key) => allKeys.add(key))
              }
            })

            const processedHtml = await processHtmlTemplate(htmlTemplate, {
              languageCodes,
              existingKeys: Array.from(allKeys).sort(),
              message: `成功添加字段 "${fieldKey}" 到 ${successCount} 个语言文件中`,
              messageType: 'success',
            })

            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
            res.end(processedHtml)
          } catch (error) {
            console.error('处理添加字段请求失败:', error)
            const processedHtml = await processHtmlTemplate(htmlTemplate, {
              message: '服务器内部错误',
              messageType: 'error',
            })
            res.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8' })
            res.end(processedHtml)
          }
        })
      return
    }

    // 编辑字段
    if (req.url === '/edit-field' && req.method === 'POST') {
      let body = []
      req
        .on('data', (chunk) => {
          console.log(chunk.keys())
          body.push(chunk)
        })
        .on('end', async () => {
          try {
            const formData = parseFormData(Buffer.concat(body))
            console.log(formData)
            const { editFieldKey, editLanguages, newValue } = formData

            if (!editFieldKey || !newValue) {
              const languageCodes = await getAllLanguageCodes()
              const languageData = await readAllLanguageFiles()

              const allKeys = new Set()
              Object.values(languageData).forEach((lang) => {
                if (lang.content && typeof lang.content === 'object') {
                  Object.keys(lang.content).forEach((key) => allKeys.add(key))
                }
              })

              const processedHtml = await processHtmlTemplate(htmlTemplate, {
                languageCodes,
                existingKeys: Array.from(allKeys).sort(),
                message: '字段键名和新值不能为空',
                messageType: 'error',
              })

              res.writeHead(400, { 'Content-Type': 'text/html; charset=utf-8' })
              res.end(processedHtml)
              return
            }

            const selectedLanguages = Array.isArray(editLanguages)
              ? editLanguages
              : editLanguages.split(',')
            let successCount = 0

            for (const langCode of selectedLanguages) {
              const filePath = path.join(localesDir, `${langCode}.ts`)
              try {
                const content = await fs.readFile(filePath, 'utf8')
                const langData = extractJsonFromTs(content)

                // 只更新存在的字段
                if (Object.prototype.hasOwnProperty.call(langData, editFieldKey)) {
                  langData[editFieldKey] = newValue[langCode]
                  await fs.writeFile(filePath, jsonToTs(langData), 'utf8')
                  successCount++
                }
              } catch (error) {
                console.error(`更新语言 ${langCode} 失败:`, error)
              }
            }

            const languageCodes = await getAllLanguageCodes()
            const languageData = await readAllLanguageFiles()

            // 获取所有唯一的字段键
            const allKeys = new Set()
            Object.values(languageData).forEach((lang) => {
              if (lang.content && typeof lang.content === 'object') {
                Object.keys(lang.content).forEach((key) => allKeys.add(key))
              }
            })

            const processedHtml = await processHtmlTemplate(htmlTemplate, {
              languageCodes,
              existingKeys: Array.from(allKeys).sort(),
              message: `成功更新字段 "${editFieldKey}" 在 ${successCount} 个语言文件中`,
              messageType: 'success',
            })

            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
            res.end(processedHtml)
          } catch (error) {
            console.error('处理编辑字段请求失败:', error)
            const processedHtml = await processHtmlTemplate(htmlTemplate, {
              message: '服务器内部错误',
              messageType: 'error',
            })
            res.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8' })
            res.end(processedHtml)
          }
        })
      return
    }

    // 404 页面
    const processedHtml = await processHtmlTemplate(htmlTemplate, {
      message: '页面未找到',
      messageType: 'error',
    })
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' })
    res.end(processedHtml)
  } catch (error) {
    console.error('处理请求失败:', error)
    // 如果无法加载模板，显示简单的错误页面
    res.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8' })
    res.end('<h1>服务器内部错误</h1>')
  }
})

// 启动服务器
server.listen(PORT, () => {
  console.log(`语言字段管理工具已启动: http://localhost:${PORT}`)
  console.log('按 Ctrl+C 停止服务器')
})

// 优雅地关闭服务器
process.on('SIGINT', () => {
  console.log('正在关闭服务器...')
  server.close(() => {
    console.log('服务器已关闭')
    process.exit(0)
  })
})
