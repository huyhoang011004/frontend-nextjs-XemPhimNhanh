import { YoutubeHomeFeed } from '@/components/home/youtube-home-feed';
import { MovieItem } from '@/components/shared/youtube-video-card';

export const revalidate = 60; // ISR 60s theo quy chuẩn SEO

// Bộ dữ liệu khởi tạo phong phú chuẩn YouTube 16:9
const MOCK_FALLBACK_MOVIES: MovieItem[] = [
  {
    _id: '1',
    title: 'Đấu La Đại Lục - Phần 2: Tuyệt Thế Đường Môn',
    slug: 'dau-la-dai-luc-2',
    originTitle: 'Soul Land Season 2',
    posterUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1200&auto=format&fit=crop&q=80',
    episodeCurrent: 'Tập 48/52',
    episodeTotal: 52,
    duration: '22 phút/tập',
    quality: '4K',
    views: 1420500,
    genres: ['Huyền Huyễn', 'Hành Động', 'Anime'],
    type: 'series',
    updatedAt: new Date(Date.now() - 2 * 3600000).toISOString(),
  },
  {
    _id: '2',
    title: 'Chiến Binh Báo Đen: Wakanda Bất Diệt',
    slug: 'black-panther-wakanda-forever',
    originTitle: 'Black Panther: Wakanda Forever',
    posterUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1200&auto=format&fit=crop&q=80',
    episodeCurrent: 'Full HD',
    episodeTotal: 1,
    duration: '161 phút',
    quality: 'FHD',
    views: 890400,
    genres: ['Hành Động', 'Viễn Tưởng', 'Siêu Anh Hùng'],
    type: 'single',
    updatedAt: new Date(Date.now() - 5 * 3600000).toISOString(),
  },
  {
    _id: '3',
    title: 'Thôn Phệ Tinh Không - Cuộc Chiến Vũ Trụ Mới',
    slug: 'thon-phe-tinh-khong',
    originTitle: 'Swallowed Star',
    posterUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&auto=format&fit=crop&q=80',
    episodeCurrent: 'Tập 112/130',
    episodeTotal: 130,
    duration: '20 phút/tập',
    quality: '4K',
    views: 2150000,
    genres: ['Khoa Học Viễn Tưởng', 'Hành Động', 'Anime'],
    type: 'series',
    updatedAt: new Date(Date.now() - 12 * 3600000).toISOString(),
  },
  {
    _id: '4',
    title: 'Avatar 2: Dòng Chảy Của Nước',
    slug: 'avatar-the-way-of-water',
    originTitle: 'Avatar: The Way of Water',
    posterUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&auto=format&fit=crop&q=80',
    episodeCurrent: 'Bản Đẹp 4K',
    episodeTotal: 1,
    duration: '192 phút',
    quality: '4K',
    views: 3450000,
    genres: ['Viễn Tưởng', 'Phiêu Lưu'],
    type: 'single',
    updatedAt: new Date(Date.now() - 24 * 3600000).toISOString(),
  },
  {
    _id: '5',
    title: 'Hạ Cánh Nơi Anh - Tình Ca Xứ Hàn',
    slug: 'crash-landing-on-you',
    originTitle: 'Crash Landing on You',
    posterUrl: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=600&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=1200&auto=format&fit=crop&q=80',
    episodeCurrent: 'Tập 16/16 (Full)',
    episodeTotal: 16,
    duration: '70 phút/tập',
    quality: 'FHD',
    views: 950000,
    genres: ['Tình Cảm', 'Hài Hước', 'Hàn Quốc'],
    type: 'series',
    updatedAt: new Date(Date.now() - 36 * 3600000).toISOString(),
  },
  {
    _id: '6',
    title: 'Oppenheimer - Kẻ Kiến Tạo Hủy Diệt',
    slug: 'oppenheimer',
    originTitle: 'Oppenheimer',
    posterUrl: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=600&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=1200&auto=format&fit=crop&q=80',
    episodeCurrent: 'Thuyết Minh',
    episodeTotal: 1,
    duration: '180 phút',
    quality: '4K',
    views: 1820000,
    genres: ['Lịch Sử', 'Tâm Lý', 'Chiếu Rạp'],
    type: 'single',
    updatedAt: new Date(Date.now() - 48 * 3600000).toISOString(),
  },
  {
    _id: '7',
    title: 'Thám Tử Lừng Danh Conan: Tàu Ngầm Sắt Màu Đen',
    slug: 'conan-tau-ngam-sat-mau-den',
    originTitle: 'Detective Conan: Black Iron Submarine',
    posterUrl: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=600&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=1200&auto=format&fit=crop&q=80',
    episodeCurrent: 'Bản Đẹp Vietsub',
    episodeTotal: 1,
    duration: '110 phút',
    quality: 'FHD',
    views: 1240000,
    genres: ['Anime & Manga', 'Trinh Thám', 'Hành Động'],
    type: 'single',
    updatedAt: new Date(Date.now() - 72 * 3600000).toISOString(),
  },
  {
    _id: '8',
    title: 'Trò Chơi Vương Quyền: Gia Tộc Rồng Mùa 2',
    slug: 'house-of-the-dragon-season-2',
    originTitle: 'House of the Dragon Season 2',
    posterUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&auto=format&fit=crop&q=80',
    episodeCurrent: 'Tập 8/8 (Full)',
    episodeTotal: 8,
    duration: '65 phút/tập',
    quality: '4K',
    views: 2900000,
    genres: ['Chiến Tranh', 'Huyền Bí', 'Phim Bộ'],
    type: 'series',
    updatedAt: new Date(Date.now() - 96 * 3600000).toISOString(),
  },
];

export default async function HomePage() {
  let movies: MovieItem[] = MOCK_FALLBACK_MOVIES;

  // Gọi API Backend lấy danh sách phim thực tế nếu backend đang chạy
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const res = await fetch(`${apiUrl}/movies?limit=24&sort=trending`, {
      next: { revalidate: 60 },
    });
    if (res.ok) {
      const data = await res.json();
      if (data.items && data.items.length > 0) {
        movies = data.items;
      }
    }
  } catch (error) {
    // Tự động sử dụng mock data fallback khi backend offline
  }

  return <YoutubeHomeFeed initialMovies={movies} />;
}
