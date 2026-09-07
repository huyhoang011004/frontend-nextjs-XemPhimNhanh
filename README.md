# WebPhim Frontend - Next.js App Router Architecture

Chào mừng bạn đến với Repository Frontend của dự án XemPhimNhanh. Ứng dụng này cung cấp giao diện hiển thị cho người dùng, xử lý các tương tác thời gian thực, quản lý trạng thái hiển thị phim và Watch Party.

## 1. Kiến trúc & Công nghệ (Tech Stack)

Frontend được xây dựng trên bộ khung Next.js mạnh mẽ nhất hiện tại:
- **Framework**: Next.js (App Router), React 19.
- **Styling**: Tailwind CSS v4.
- **UI Component System**: [Shadcn UI](https://ui.shadcn.com/) (Dựa trên Base UI). Hỗ trợ chuẩn xác hệ thống màu YouTube Dark Mode thông qua CSS Variables (tại `globals.css`).
- **State Management**:
  - **Zustand**: Quản lý Client State (Đồng bộ Session User vào Local Storage thông qua middleware `persist`).
  - **React Query** (`@tanstack/react-query`): Quản lý Server State (Xử lý Fetching, Caching, Retry và Auto-refetch dữ liệu).
- **Video Player**: Hỗ trợ HLS.js để truyền phát luồng video chất lượng cao mượt mà.

## 2. Cấu trúc Thư mục

```text
src/
├── app/                        # Next.js App Router (Chứa các Pages, Layout, Route logic)
├── components/                 # Nơi chứa toàn bộ UI
│   ├── ui/                     # Các base components của Shadcn (Button, Input, Dropdown...)
│   ├── shared/                 # Các components dùng chung (Navbar, Movie Card, Comment Section...)
│   └── watch/                  # Các components đặc thù của luồng Xem phim (Watch View)
├── lib/                        # Các file cấu hình & Utilities
│   └── api-client.ts           # Cấu hình Axios + Auto Refresh Token Interceptors
├── store/                      # Quản lý State bằng Zustand
│   ├── use-auth-store.ts       # Chứa logic lưu trữ User Session
│   └── use-sidebar-store.ts    # Logic toggle Sidebar
```

## 3. Cốt lõi & Quy tắc Quan trọng cho Lập trình viên mới

Bất kỳ Frontend Developer nào tham gia dự án cần tuân thủ triệt để các luật (Rules) sau để giữ codebase nhất quán:

### A. Fetch Data bằng React Query (TUYỆT ĐỐI KHÔNG DÙNG `useEffect` để fetch)
- Không sử dụng `useEffect` kết hợp `useState` để lấy dữ liệu từ API. 
- Mọi dữ liệu đến từ Server (như Lấy danh sách phim, Lấy bình luận) đều phải sử dụng `useQuery`.
- Mọi thao tác thay đổi dữ liệu Server (như Post comment, Gửi rating) đều phải sử dụng `useMutation`.
- Lợi ích: Tự động gom nhóm request (Deduplication), tự động Cache, và tự động làm mới màn hình (Invalidate queries).

### B. Sử dụng API Client
- Tuyệt đối không dùng `fetch()` hay `axios` trực tiếp. Hãy import `apiClient` từ `@/lib/api-client`.
- `apiClient` đã được cài đặt sẵn Interceptors để đính kèm `Access Token` vào Header, cũng như tự động gia hạn (Refresh Token) mỗi khi Token hết hạn (Lỗi 401).

### C. UI & Styling (Shadcn UI)
- Tránh viết CSS thuần. Mọi thay đổi về giao diện đều dùng class của Tailwind CSS.
- Khi cần tạo Nút bấm, Ô input, hay Popup, hãy tái sử dụng các Component đã được cấu hình trong `src/components/ui`. Đừng tự code lại từ đầu.
- Giao diện của dự án theo phong cách YouTube (Giao diện đen nhám). Bảng màu chuẩn được quy định tại `:root` trong `src/app/globals.css`.

## 4. Cách khởi chạy dự án Local

1. Khởi chạy Backend NestJS (bắt buộc để có API).
2. Di chuyển vào thư mục frontend:
   `cd frontend-nextjs`
3. Cài đặt các gói thư viện:
   `npm install`
4. Khởi động ứng dụng Next.js:
   `npm run dev`

Truy cập `http://localhost:3000` trên trình duyệt để bắt đầu trải nghiệm!
