import { Request, Response, NextFunction } from "express";
import { uploadToCloudinary } from "../../helper/uploadToCloundinary";

// Định nghĩa kiểu cho req.files của Multer khi dùng fields
interface MulterRequest extends Request {
  file?: Express.Multer.File;
  files?: { [fieldname: string]: Express.Multer.File[] } | Express.Multer.File[];
}

// single file
export const uploadSingle = async (req: Request, res: Response, next: NextFunction) => {
  // Ép kiểu req thành any hoặc MulterRequest để truy cập .file
  const multerReq = req as any;

  if (multerReq.file) {
    try {
      const result = await uploadToCloudinary(multerReq.file.buffer);
      req.body[multerReq.file.fieldname] = result;
    } catch (error) {
      console.log(error);
    }
  }

  next();
};

// multi file
export const uploadFields = async (req: Request, res: Response, next: NextFunction) => {
  const multerReq = req as any;
  const files = multerReq.files;

  if (files) {
    for (const key in files) {
      req.body[key] = [];

      // Vì files có thể là mảng hoặc object, ta cần ép kiểu để lặp
      const array = files[key] as Express.Multer.File[];

      for (const item of array) {
        try {
          const result = await uploadToCloudinary(item.buffer);
          req.body[key].push(result);
        } catch (error) {
          console.log(error);
        }
      }
    }
  }

  next();
};