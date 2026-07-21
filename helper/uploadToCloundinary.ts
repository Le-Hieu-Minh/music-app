import { v2 as cloudinary, UploadApiResponse, UploadApiErrorResponse } from "cloudinary";
import streamifier from "streamifier";
import dotenv from "dotenv";
dotenv.config();

// 1. Dùng dấu ! để khẳng định biến môi trường tồn tại
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME!,
  api_key: process.env.CLOUD_KEY!,
  api_secret: process.env.CLOUD_SECRET!,
});

// 2. Định nghĩa kiểu cho Promise: trả về UploadApiResponse nếu thành công
const streamUpload = (buffer: Buffer): Promise<UploadApiResponse> => {
  return new Promise((resolve, reject) => {
    let stream = cloudinary.uploader.upload_stream(
      { resource_type: 'auto' },
      (error: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
        if (result) {
          resolve(result);
        } else {
          reject(error);
        }
      }
    );

    streamifier.createReadStream(buffer).pipe(stream);
  });
};

export const uploadToCloudinary = async (buffer: Buffer): Promise<string> => {
  // 3. Lúc này result sẽ có kiểu UploadApiResponse, truy cập .url thoải mái
  const result: UploadApiResponse = await streamUpload(buffer);
  return result.url; // Không cần dùng result["url"] kiểu cũ nữa
};