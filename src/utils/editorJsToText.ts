export function safeParseEditorData(raw: any): any | null {
  if (!raw) return null
  if (typeof raw === 'string') {
    try { return JSON.parse(raw) } catch { return null }
  }
  if (typeof raw === 'object') return raw
  return null
}

function inlineText(s: string) {
  return (s || '')
    .replace(/<\/?[^>]+(>|$)/g, '')
    .replace(/\s+\n/g, '\n')
    .trim()
}

export function editorDataToMarkdown(data: any): string {
  if (!data || !Array.isArray(data.blocks)) return ''
  const out: string[] = []
  for (const b of data.blocks) {
    const type = b.type
    const d = b.data || {}

    switch (type) {
      case 'paragraph':
        out.push(inlineText(d.text))
        break

      case 'header': {
        const level = Math.min(Math.max(d.level || 1, 1), 6)
        out.push(`${'#'.repeat(level)} ${inlineText(d.text)}`)
        break
      }

      case 'list': {
        const style = d.style || 'unordered'
        const items: string[] = (d.items || []).map((it: any) =>
          (style === 'ordered' ? '1. ' : '- ') + inlineText(typeof it === 'string' ? it : it.content || it.text || '')
        )
        out.push(items.join('\n'))
        break
      }

      case 'quote':
        out.push(`> ${inlineText(d.text)}${d.caption ? `\n> — ${inlineText(d.caption)}` : ''}`)
        break

      case 'code':
        out.push('```\n' + (d.code || '') + '\n```')
        break

      case 'table': {
        const rows: string[][] = d.content || []
        if (rows.length) {
          const header = rows[0].map((c: string) => inlineText(c)).join(' | ')
          const sep = rows[0].map(() => '---').join(' | ')
          const body = rows.slice(1).map((r: string[]) => r.map(c => inlineText(c)).join(' | ')).join('\n')
          out.push(`${header}\n${sep}\n${body}`)
        }
        break
      }

      case 'delimiter':
        out.push('\n---\n')
        break

      case 'image':
        if (d.file?.url) {
          out.push(`![${inlineText(d.caption || 'imagen')}](${d.file.url})`)
        }
        break

      case 'checklist': {
        const items: string[] = (d.items || []).map((it: any) =>
          `- [${it.checked ? 'x' : ' '}] ${inlineText(it.text || '')}`
        )
        out.push(items.join('\n'))
        break
      }

      default:
        if (d.text) out.push(inlineText(d.text))
        break
    }
  }
  return out.join('\n\n').trim()
}