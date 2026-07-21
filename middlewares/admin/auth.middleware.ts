import { Request, Response, NextFunction } from "express";
import Account from "../../models/account.model";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

import { systemConfig } from "../../config/config";
import Role from "../../models/role.model";
import Blacklist from "../../models/blacklist.model";

dotenv.config();

// 1. Định nghĩa cấu trúc của Token Payload
interface UserPayload extends jwt.JwtPayload {
  id: string;
  role_id: string;
}

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.token;
  const refreshToken = req.cookies.refreshToken;

  if (!token) return res.redirect(`/${systemConfig.prefixAdmin}/auth/login`);

  const isBlacklisted = await Blacklist.findOne({ token: token });
  if (isBlacklisted) {
    return res.redirect(`/${systemConfig.prefixAdmin}/auth/login`);
  }

  try {
    // 2. Ép kiểu cho kết quả trả về của verify
    const decode = jwt.verify(token, process.env.JWT_ACCESS_KEY!) as UserPayload;

    if (decode && typeof decode !== "string") {
      const user = await Account.findOne({ _id: decode.id }).select('-password');
      const role = await Role.findOne({ _id: decode.role_id });

      if (!user) return res.redirect(`/${systemConfig.prefixAdmin}/auth/login`);

      res.locals.user = user;
      res.locals.role = role;
      next();
    }

  } catch (err: any) {
    // 3. Kiểm tra lỗi hết hạn token một cách an toàn
    if (err.name === 'TokenExpiredError' && refreshToken) {
      return res.redirect(`/${systemConfig.prefixAdmin}/auth/refresh-token`);
    }
    res.redirect(`/${systemConfig.prefixAdmin}/auth/login`);
  }
};