import xml from 'xml'
import type { RequestHandler } from '@sveltejs/kit'
import { findPostingsForUser } from '$lib/server/db'

export const GET: RequestHandler = async ({ url, locals }) => {
  // When the user navigates to `/feed.xml` while being logged in, we assume that they want to copy
  // the URL to put into a reader. So we'll append their rss_token to the URL so it will give them
  // the access they expect.
  if (locals.user?.rssToken && url.searchParams.get('rss_token') !== locals.user.rssToken) {
    url.searchParams.set('rss_token', locals.user.rssToken);
    const appendedUrl = url.pathname + url.search;

    return new Response(null, {
      status: 302,
      headers: {
        'Location': appendedUrl
      }
    });
  }

  const posts = await findPostingsForUser(locals.user?.id)

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

  // todo add query param to path, if its not already there
  return new Response(xml_string, {
    headers: {
      'Content-Type': 'text/xml; charset=utf-8'
    }
  })
}
