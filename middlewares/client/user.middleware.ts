import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../../models/user.model";
import Blacklist from "../../models/blacklist.model";

interface UserPayload extends jwt.JwtPayload {
  id: string;
}

export const userInfo = async (req: Request, res: Response, next: NextFunction) => {
  const tokenUs = req.cookies.tokenUs;

  if (tokenUs) {
    try {
      const isBlackListed = await Blacklist.findOne({ token: tokenUs });
      if (isBlackListed) {
        return next();
      }

      const decode = jwt.verify(tokenUs, process.env.JWT_ACCESS_KEY!) as UserPayload;

      if (decode && decode.id) {
        const customer = await User.findOne({
          _id: decode.id,
          deleted: false,
          status: "active"
        }).select("-password");

        if (customer) {
          res.locals.custummer = customer;
        }
      }
    } catch (error) {
      // Token hết hạn / không hợp lệ: không set user, vẫn cho xem trang public
    }
  }

  next();
};
