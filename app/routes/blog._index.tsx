/**
 * Blog list page
 */

import type { ContentStoreEntry } from '~/services/content-store';
import type { V2_MetaArgs } from '@remix-run/react';
import { Link, useMatches } from '@remix-run/react';
import { ChevronRight } from 'lucide-react';
import type { loader as rootLoader } from '~/root';
import { getSeoMetas } from '~/utils/seo';

function BlogRow({ hostUrl, entry }: { hostUrl: string; entry: ContentStoreEntry }) {
  const metadata = entry.metadata;
  return (
    <Link to={`${hostUrl}/Blog/${entry.slug}`} className='flex flex-row justify-between'>
      <span className='text-xl'>{metadata?.title as string}</span>
      <ChevronRight />
    </Link>
  );
}

export function meta({ matches, location, data }: V2_MetaArgs<unknown, { root: typeof rootLoader }>) {
  const hostUrl = matches.find((match) => match.id === 'root')?.data?.hostUrl as string;
  return getSeoMetas({
    url: hostUrl + location.pathname,
    title: 'Blog | Hungry Tapir',
    description:
      "Dive into Hungry Tapir LDN's blog and explore a world of flavors, traditions, and culinary insights. From delicious recipes featuring our signature Kaya to behind-the-scenes stories, cooking tips, and more, our blog offers a rich and engaging experience for food enthusiasts and Kaya lovers alike.",
  });
}

export default function BlogIndex() {
  const matches = useMatches();
  if (!matches) {
    return null;
  }
  const loaderData = matches.find((element: any) => element.id === 'routes/blog')?.data ?? [];

  const hostUrl = loaderData.host as string;
  const data = loaderData.data as ContentStoreEntry[];

  return (
    <div className='flex flex-col'>
      <div className='content-wrapper bg-ht-turquoise'>
        <div className='content-container'>
          <h1 className='title title-section text-center'>Blog</h1>
        </div>
      </div>
      <div className='content-wrapper'>
        <div className='content-container my-16'>
          <ul role='list' className='divide-y divide-gray-100'>
            {data?.map((entry: ContentStoreEntry) => (
              <li key={entry.slug} className='m-4 p-4'>
                <BlogRow hostUrl={hostUrl} entry={entry} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
