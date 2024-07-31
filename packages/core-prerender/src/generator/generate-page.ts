import axios from 'axios'

type GeneratePageOptions = {
  url: string
  mode: 'ssg' | 'csr'
  language: 'en' | 'ru'
  device?: 'desktop' | 'mobile'
}

export async function generatePage({ url, mode, language = 'en', device = 'desktop' }: GeneratePageOptions) {
  try {
    const response = await axios.get(url, {
      headers: {
        'x-generate': mode,
        'accept-language': language,
        'user-agent':
          device === 'desktop'
            ? 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_4_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
            : 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4.1 Mobile/15E148 Safari/604.1',
      },
    })

    return response.data
  } catch (error) {
    console.error(`Error generating page: ${url}`, error)
  }
}
