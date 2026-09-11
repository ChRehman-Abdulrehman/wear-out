import { Helmet } from 'react-helmet-async';

const SITE = 'https://wearout.shop';
const NAME = 'Wear Out';

export default function SEO({
  title,
  description,
  image,
  url,
  type = 'website',
  keywords,
  jsonLd,
}) {
  const fullTitle = title ? `${title} | ${NAME}` : `${NAME} — Premium Streetwear Pakistan`;
  const fullUrl = url ? `${SITE}${url}` : SITE;
  const ogImage = image || `${SITE}/assets/logo.webp`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}
      {keywords && <meta name="keywords" content={keywords} />}

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      {description && <meta property="og:description" content={description} />}
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={NAME} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      {description && <meta name="twitter:description" content={description} />}
      <meta name="twitter:image" content={ogImage} />

      <link rel="canonical" href={fullUrl} />

      {jsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      )}
    </Helmet>
  );
}
