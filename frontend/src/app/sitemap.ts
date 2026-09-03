import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  // Update this with your actual production URL when deploying
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.mujmart.in'

  return [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/search`,
      lastModified: new Date(),
      changeFrequency: 'always',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/cart`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.7,
    },
    // You can also fetch dynamic data here (like listings, categories) 
    // and map them to their respective URLs to include them in the sitemap.
  ]
}
