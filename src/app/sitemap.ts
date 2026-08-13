import { MetadataRoute } from 'next';
import { apiClient } from '@/lib/api-client';

export const revalidate = 3600; // 1 hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://webphimnhanh.com';
  
  // Mặc định luôn có trang chủ và các trang danh sách
  const routes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}`, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${baseUrl}/danh-sach/phim-le`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${baseUrl}/danh-sach/phim-bo`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
  ];

  // Fetch API lấy list phim (Tối đa 1000 phim mới nhất để SEO)
  try {
    const res = await apiClient.get('/movies?limit=1000');
    if (res.data.success) {
      const movies = res.data.data.movies || [];
      movies.forEach((movie: any) => {
        routes.push({
          url: `${baseUrl}/phim/${movie.slug}`,
          lastModified: new Date(movie.updatedAt),
          changeFrequency: 'weekly',
          priority: 0.9,
        });
        
        // Nếu là phim có tập, ta gen luôn các URL tập phim
        if (movie.episodes) {
          movie.episodes.forEach((ep: any) => {
            routes.push({
              url: `${baseUrl}/phim/${movie.slug}/${ep.slug}`,
              lastModified: new Date(ep.updatedAt || movie.updatedAt),
              changeFrequency: 'monthly',
              priority: 0.7,
            });
          });
        }
      });
    }
  } catch (e) {
    console.error('Lỗi gen sitemap', e);
  }

  return routes;
}
