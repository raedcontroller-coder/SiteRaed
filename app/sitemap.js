export default async function sitemap() {
  const baseUrl = 'https://raed.world';
  const lastModified = new Date();

  return [
    {
      url: baseUrl,
      lastModified,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/portfolio`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/calculadora`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ];
}

