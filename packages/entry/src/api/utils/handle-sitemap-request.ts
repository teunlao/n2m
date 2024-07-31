import { SitemapStream, streamToPromise, SitemapItemLoose, EnumChangefreq } from 'sitemap'
import { Context } from 'hono'
import path from 'node:path'
import { promises as fs, existsSync, readFileSync, mkdirSync } from 'fs'

const pages: SitemapItemLoose[] = [
  { url: '/', changefreq: EnumChangefreq.DAILY, priority: 1.0 },
  { url: '/slots', changefreq: EnumChangefreq.MONTHLY, priority: 0.8 },
  { url: '/live-casino', changefreq: EnumChangefreq.MONTHLY, priority: 0.8 },
  { url: '/bonuses', changefreq: EnumChangefreq.MONTHLY, priority: 0.8 },
  { url: '/vip-zone', changefreq: EnumChangefreq.MONTHLY, priority: 0.8 },
  { url: '/about-us', changefreq: EnumChangefreq.MONTHLY, priority: 0.8 },
  { url: '/payments', changefreq: EnumChangefreq.MONTHLY, priority: 0.8 },
  { url: '/faq', changefreq: EnumChangefreq.MONTHLY, priority: 0.8 },
  { url: '/responsible-gaming', changefreq: EnumChangefreq.MONTHLY, priority: 0.8 },
  { url: '/terms-and-conditions', changefreq: EnumChangefreq.MONTHLY, priority: 0.8 },
  { url: '/privacy-policy', changefreq: EnumChangefreq.MONTHLY, priority: 0.8 },
  { url: '/bonuses-terms', changefreq: EnumChangefreq.MONTHLY, priority: 0.8 },
]

type IGame = { slug: string }
type IGames = { data: IGame[] }

const generateSitemap = async (hostname: string): Promise<string> => {
  try {
    const sitemapStream = new SitemapStream({ hostname })

    for (const page of pages) {
      sitemapStream.write(page)
    }

    // for (const game of games['data']) {
    //   sitemapStream.write({ url: `/game/${game.slug}`, changefreq: EnumChangefreq.MONTHLY, priority: 0.8 })
    // }

    sitemapStream.end()
    const xmlString = (await streamToPromise(sitemapStream)).toString()
    return xmlString
  } catch (error) {
    console.error('Error generating sitemap:', error)
    throw error
  }
}

export const handleSitemapRequest = async (c: Context) => {
  try {
    const hostname = c.req.raw.headers.get('x-forwarded-host')! || c.req.raw.headers.get('host')!
    if (!hostname) {
      return new Response('Host header is missing', { status: 400 })
    }
    const sitemapPathToSave = path.join(process.cwd(), `./public/${hostname}`)
    const sitemapPath = sitemapPathToSave + '/sitemap.xml'
    if (existsSync(sitemapPath)) {
      const sitemapContent = readFileSync(sitemapPath, 'utf-8')
      return new Response(sitemapContent, {
        status: 200,
        headers: {
          'Content-Type': 'application/xml',
        },
      })
    } else {
      mkdirSync(sitemapPathToSave)
      // For local host https should be changed to http
      // const proxyUrl = new URL(`https://${hostname}/api/games-v2`)
      // const apiResponse = await fetch(proxyUrl.toString(), {
      //   method: 'GET',
      //   headers: c.req.raw.headers,
      // })
      // if (!apiResponse.ok) {
      //   throw new Error('Failed to fetch games data')
      // }
      // const games = (await apiResponse.json()) as IGames
      const xmlString = await generateSitemap(`https://${hostname}`)
      await fs.writeFile(sitemapPath, xmlString)
      return new Response(xmlString, {
        status: 200,
        headers: {
          'Content-Type': 'application/xml',
        },
      })
    }
  } catch (error) {
    console.error('Error generating sitemap:', error)
  }
}
