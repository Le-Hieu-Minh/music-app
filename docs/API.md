# Routes / API

## Client (HTML + một số JSON)

| Method | Path | Auth | Mô tả |
|--------|------|------|--------|
| GET | `/` | | Trang chủ |
| GET | `/topics` | | Chủ đề |
| GET | `/songs/:slugTopic` | | Bài theo chủ đề (`?page=`) |
| GET | `/songs/detail/:slugSong` | | Chi tiết + queue |
| PATCH | `/songs/like/:type/:id` | JWT | `like` \| `dislike` → JSON |
| PATCH | `/songs/favorite/:type/:id` | JWT | `favorite` \| `unfavorite` → JSON |
| PATCH | `/songs/listen/:id` | | Tăng listen → JSON |
| GET | `/singers` | | Danh sách ca sĩ |
| GET | `/singers/:slug` | | Chi tiết ca sĩ |
| GET | `/charts?type=listen\|like&page=` | | BXH |
| GET | `/search/:type` | | `result` (HTML) / `suggest` (JSON) |
| GET | `/favorite-songs` | JWT | Yêu thích |
| GET/POST | `/playlists` … | JWT | Playlist (xem FEATURES) |
| GET/POST | `/users/*` | * | Auth + profile |

### Playlist (JWT)

| Method | Path | Mô tả |
|--------|------|--------|
| GET | `/playlists` | Danh sách |
| GET/POST | `/playlists/create` | Tạo |
| GET | `/playlists/:slug` | Chi tiết |
| GET | `/playlists/api/mine` | JSON list playlist |
| POST | `/playlists/:id/songs` | Thêm bài (`songId`) |
| PATCH | `/playlists/:id/songs/:songId` | Gỡ bài |
| PATCH | `/playlists/delete/:id` | Xóa playlist |

## Admin (prefix `/admin`)

Hầu hết route cần cookie JWT admin. Route songs kiểm tra thêm permission:

- `music_view`, `music_create`, `music_edit`, `music_delete`

Ví dụ: `GET /admin/songs?keyword=&page=`

## JSON response chuẩn (client PATCH)

```json
{ "code": 200, "message": "Thành công", "like": 12 }
```

`code`: `200` OK, `400` bad request, `401` chưa login, `403` không đủ quyền (admin), `404` không tìm thấy.
