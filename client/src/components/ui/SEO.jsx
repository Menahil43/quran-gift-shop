import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description, image, url }) => {
  const siteTitle = 'Quran Gift Shop';
  const fullTitle = `${title} | ${siteTitle}`;
  const defaultDesc = 'Premium Islamic gifts including Quran Pak, Tasbeeh, Rehal, and Luxury Gift Sets curated with love and respect.';
  const siteUrl = 'https://qurangiftshop.com';
  const defaultImage = '/og-image.jpg';

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description || defaultDesc} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url || siteUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description || defaultDesc} />
      <meta property="og:image" content={image || defaultImage} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url || siteUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description || defaultDesc} />
      <meta name="twitter:image" content={image || defaultImage} />

      {/* Semantic Tags */}
      <link rel="canonical" href={url || siteUrl} />
    </Helmet>
  );
};

export default SEO;
