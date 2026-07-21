# Music App

Web nghe nhạc (Express + MongoDB + Pug + TypeScript) gồm **Client** và **Admin**.

## Yêu cầu

- Node.js 18+
- MongoDB
- Tài khoản Cloudinary, SendGrid (upload media / gửi OTP)

## Cài đặt

```bash
npm install
```

Tạo file `.env`:

```env
PORT=3000
MONGO_URL=mongodb://127.0.0.1:27017/music-app
CLOUD_NAME=
CLOUD_KEY=
CLOUD_SECRET=
JWT_ACCESS_KEY=your-access-secret
JWT_REFRESH_KEY=your-refresh-secret
JWT_RESETPW_KEY=your-reset-secret
SENDGRID_API_KEY=
EMAIL_FROM=noreply@example.com
COOKIE_SECRET=
SESSION_SECRET=
```

Chạy:

```bash
npm start
```

- Client: `http://localhost:3000`
- Admin: `http://localhost:3000/admin`

## Scripts

| Lệnh | Mô tả |
|------|--------|
| `npm start` | Chạy server (nodemon) |
| `npm test` | Chạy unit tests (Jest) |
| `npm run test:watch` | Jest watch mode |

## Tài liệu thêm

- [Chức năng & nghiệp vụ](docs/FEATURES.md)
- [API / Routes](docs/API.md)
- [Hướng dẫn test](docs/TESTING.md)
