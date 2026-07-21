# Nghiệp vụ & chức năng

## Client

### Core nghe nhạc
- Trang chủ: chủ đề, ca sĩ, bài nổi bật (theo listen), bài mới
- Chủ đề → danh sách bài (có phân trang)
- Ca sĩ: danh sách + chi tiết bài của ca sĩ
- Chi tiết bài: APlayer, lyrics, like, yêu thích
- **Queue / Next–Prev**: danh sách phát cùng chủ đề trong APlayer + nút bài trước/sau
- Đếm lượt nghe khi play

### Khám phá
- Tìm kiếm + gợi ý realtime
- **BXH** `/charts`: theo lượt nghe hoặc like (phân trang)

### Cá nhân (cần đăng nhập)
- Yêu thích bài hát
- **Playlist**: tạo, xem, thêm bài từ trang chi tiết, gỡ bài, xóa playlist
- Hồ sơ: xem / sửa tên, đổi mật khẩu

### Auth
- Đăng ký, đăng nhập, JWT cookie
- Quên mật khẩu: OTP email → đặt lại MK

## Admin (`/admin`)

- Dashboard thống kê
- CRUD chủ đề / bài hát / ca sĩ
- Nhóm quyền + phân quyền (UI + **middleware kiểm tra quyền** trên route songs)
- Tài khoản admin, quản lý user (tìm kiếm + phân trang)
- Cài đặt chung (logo, tên web…)
- Upload ảnh TinyMCE (yêu cầu đăng nhập)

## Model chính

| Collection | Mục đích |
|------------|----------|
| songs | Bài hát |
| topics | Chủ đề |
| singers | Ca sĩ |
| users | User client |
| accounts / roles | Admin & RBAC |
| favorite-songs | Yêu thích |
| playlists | Playlist cá nhân |
| forgot-password | OTP |
| blacklists | Token logout |
| setting-general | Cấu hình site |

## Luồng ưu tiên đã bổ sung gần đây

1. Playlist cá nhân  
2. Queue nghe liên tục + next/prev  
3. Bảng xếp hạng + phân trang  
4. Admin search/pagination + `requirePermission` cho songs  
