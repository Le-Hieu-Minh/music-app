# Testing

## Stack

- **Jest** + **ts-jest**
- Unit test cho helper / logic thuần (không cần MongoDB)

## Chạy test

```bash
npm test
npm run test:watch
```

## Cấu trúc

```
tests/
  helper/
    pagination.test.ts
    convertToSlug.test.ts
    generate.test.ts
  middleware/
    permission.test.ts
```

## Viết test mới

1. Đặt file trong `tests/**/*.test.ts`
2. Import module từ project (CommonJS / ts-jest)
3. Không commit `.env` thật vào test; mock `process.env` nếu cần

## Phạm vi hiện tại

- Phân trang: biên page, skip, totalPage
- Slug: bỏ dấu, khoảng trắng
- Generate: độ dài chuỗi/số
- Permission middleware: cho phép / chặn 403 / redirect

Integration test (supertest + DB) có thể bổ sung sau khi có Mongo memory server.
