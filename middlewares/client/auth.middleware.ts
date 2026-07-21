import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import Blacklist from "../../models/blacklist.model";
import User from "../../models/user.model";

dotenv.config();

interface UserPayload extends jwt.JwtPayload {
  id: string;
}

const isApiRequest = (req: Request): boolean => {
  return req.method !== "GET" && req.method !== "HEAD";
};

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  const tokenUs = req.cookies.tokenUs;
  const refreshTokenUs = req.cookies.refreshTokenUs;

  if (!tokenUs) {
    if (isApiRequest(req)) {
      return res.status(401).json({ code: 401, message: "Vui lòng đăng nhập" });
    }
    return res.redirect(`/users/login`);
  }

  const isBlackListed = await Blacklist.findOne({ token: tokenUs });
  if (isBlackListed) {
    if (isApiRequest(req)) {
      return res.status(401).json({ code: 401, message: "Phiên đăng nhập đã hết hạn" });
    }
    return res.redirect(`/users/login`);
  }

  try {
    const decode = jwt.verify(tokenUs, process.env.JWT_ACCESS_KEY!) as UserPayload;

    if (decode && decode.id) {
      const user = await User.findOne({
        _id: decode.id,
        deleted: false,
        status: "active"
      }).select("-password");

      if (!user) {
        if (isApiRequest(req)) {
          return res.status(401).json({ code: 401, message: "Tài khoản không hợp lệ" });
        }
        return res.redirect(`/users/login`);
      }

      res.locals.user = user;
      return next();
    }

    if (isApiRequest(req)) {
      return res.status(401).json({ code: 401, message: "Token không hợp lệ" });
    }
    return res.redirect(`/users/login`);
  } catch (error: any) {
    if (error.name === "TokenExpiredError" && refreshTokenUs) {
      if (isApiRequest(req)) {
        return res.status(401).json({ code: 401, message: "Token hết hạn, vui lòng tải lại trang" });
      }
      return res.redirect(`/users/refresh-token`);
    }

    if (isApiRequest(req)) {
      return res.status(401).json({ code: 401, message: "Xác thực thất bại" });
    }
    return res.redirect(`/users/login`);
  }
};
