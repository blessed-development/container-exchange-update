import { Helmet } from 'react-helmet-async';
import { SITE_URL, toAbsoluteUrl } from '@/lib/seo';

export default function PageSeo({ title, description, path, image = '/images/hero/depot-operations.png' }) {
  const canonicalUrl = path === '/' ? SITE_URL : toAbsoluteUrl(path);
  const imageUrl = toAbsoluteUrl(image);

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:url" content={canonicalUrl} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
    </Helmet>
  );
}
