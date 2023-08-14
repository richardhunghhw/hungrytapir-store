/**
 * FAQ page
 */

import { redirect } from '@remix-run/cloudflare';
import type { V2_MetaArgs } from '@remix-run/react';
import { Link, useLoaderData, useMatches } from '@remix-run/react';
import { isProd } from '~/utils/misc';
import type { HTActionArgs } from '~/utils/types';
import type { ContentStoreFaqEntry } from '~/services/content-store';
import { validateRequest, getFaq } from '~/services/content-store';
import { ArrowLeft } from 'lucide-react';
import { MarkdownContent } from '~/components/markdown-content';
import { getSeoMetas } from '~/utils/seo';
import type { loader as rootLoader } from '~/root';

export function meta({ matches, location, data }: V2_MetaArgs<typeof loader, { root: typeof rootLoader }>) {
  const hostUrl = matches.find((match) => match.id === 'root')?.data?.hostUrl as string;
  return getSeoMetas({
    url: hostUrl + location.pathname,
    title: data?.metadata?.title ? data.metadata.title + ' | Hungry Tapir' : undefined,
    // description: data?.metadata?.description,
  });
}

export async function loader({ request: { url }, context, params }: HTActionArgs) {
  // Fetch faq data from content-store
  try {
    const urlPath = validateRequest(new URL(url));
    const result = await getFaq(context, urlPath.slug);
    if (!result) {
      // todo sentry error
      throw new Error('FAQ Entry not found');
    }
    return result;
  } catch (error) {
    console.error(error); // TODO badlink
    if (isProd(context)) return redirect('/404');
  }
  return null;
}

export default function Faq() {
  const matches = useMatches();
  const parentData = matches.find((element: any) => element.id === 'routes/faq')?.data;
  const hostUrl = parentData.host as string;

  const faqEntry = useLoaderData<ContentStoreFaqEntry>();
  if (!faqEntry || !faqEntry.data) return null;
  const faqContent = faqEntry.data.faq;

  return (
    <div className='flex flex-col'>
      <div className='content-wrapper bg-ht-green-highlight'>
        <div className='content-container'>
          <div className='title-section flex flex-col'>
            <Link to={`${hostUrl}/faq`} className='text-base'>
              <ArrowLeft className='inline text-base' /> Back to FAQs
            </Link>
            <h1 className='title text-center' id={faqEntry.metadata.slug}>
              {faqEntry.metadata.title}
            </h1>
          </div>
        </div>
      </div>
      <div className='content-wrapper body-text-wrapper'>
        <div className='content-container mt-4'>
          <div className='prose prose-lg max-w-none'>
            <MarkdownContent data={faqContent} />
          </div>
        </div>
      </div>
    </div>
  );
}
