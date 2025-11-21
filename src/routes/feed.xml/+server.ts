import xml from 'xml'
import type { RequestHandler } from '@sveltejs/kit'
import { findAllPostings } from '$lib/server/db'

export const GET: RequestHandler = async ({ url }) => {
  const posts = await findAllPostings()

  const BASE_URL = url.origin
  const base = (route: string) => {
    return `${BASE_URL}${route}`
  }

  const items = posts.map((post) => ({
    item: [
      { title: post.title },
      { link: base(`/read/${post.id}`) },
      { pubDate: new Date(post.pubDate).toUTCString() },
      { guid: base(`/read/${post.id}`) },
      { description: post.description }
    ]
  }))

  const rss = {
    rss: [
      {
        _attr: {
          version: '2.0',
          'xmlns:atom': 'http://www.w3.org/2005/Atom'
        }
      },
      {
        channel: [
          { title: 'Your Blog Name' },
          { link: BASE_URL },
          { description: 'The official feed for Your Blog Name.' },
          { lastBuildDate: new Date().toUTCString() },
          {
            'atom:link': {
              _attr: { href: base(`/feed.xml`), rel: 'self', type: 'application/rss+xml' }
            }
          },
          ...items
        ]
      }
    ]
  }

  const xml_string = xml(rss, { declaration: true })

  return new Response(xml_string, {
    headers: {
      'Content-Type': 'text/xml; charset=utf-8'
    }
  })
}
