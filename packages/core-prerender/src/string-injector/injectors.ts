export function chainTransformers(
  inputString: string,
  transformers: ((input: string) => string | Promise<string>)[]
): Promise<string> {
  return transformers.reduce(async (currentString, transformer) => {
    if (!transformer) return currentString
    return transformer(await currentString)
  }, Promise.resolve(inputString))
}

export function createHtmlAttributeInsertion(
  fetchAttributes: () => Promise<{ [key: string]: string }>
): (input: string) => Promise<string> {
  return async (content: string) => {
    const attributes = await fetchAttributes()
    const attributesString = Object.entries(attributes ?? {})
      .map(([key, value]) => `${key}="${value}"`)
      .join(' ')

    const htmlTagRegex = /<html\s*([^>]*)>/i
    return content.replace(htmlTagRegex, (match, p1) => `<html ${attributesString} ${p1}>`)
  }
}

export function createTagInsertion(
  tag: string,
  insert: () => Promise<string> | string
): (input: string) => Promise<string> {
  return async (content: string) => {
    const closingTagRegex = new RegExp(`</${tag}>`, 'i')
    const match = content.match(closingTagRegex)

    if (match) {
      const html = await insert()
      const insertionIndex = match.index!

      return content.slice(0, insertionIndex) + html + content.slice(insertionIndex)
    }

    return content
  }
}

export function createScriptToBodyStartTransformStream(): (input: string) => Promise<string> {
  return async (content: string) => {
    const scriptRegex = /<script\b[^>]*>\s*window\.__staticRouterHydrationData[\s\S]*?<\/script>/i
    const bodyTagRegex = /(<body[^>]*>)/i

    const foundScript = content.match(scriptRegex)
    const foundBodyTag = content.match(bodyTagRegex)

    if (foundScript && foundBodyTag) {
      const script = foundScript[0]
      const bodyTag = foundBodyTag[0]

      const contentWithoutScript = content.replace(script, '')
      return contentWithoutScript.replace(bodyTag, `${bodyTag}\n${script}`)
    }

    return content
  }
}
