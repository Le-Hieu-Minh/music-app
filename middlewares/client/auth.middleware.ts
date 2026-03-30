import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import Blacklist from "../../models/blacklist.model";
import User from "../../models/user.model";


dotenv.config();

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  const tokenUs = req.cookies.tokenUs;
  const refreshTokenUs = req.cookies.refreshTokenUs;

  if (!tokenUs) {
    return res.redirect(`/`);
  }
  const isBlackListed = await Blacklist.findOne({ token: tokenUs });
  if (isBlackListed) {
    return res.redirect(`/`);
  }
  try {
    const decode = jwt.verify(tokenUs, process.env.JWT_ACCESS_KEY);
    const user = await User.findOne({ _id: decode.id }).select('-password');
    if (!user) {
      return res.redirect(`/users/login`);
    } else {
      res.locals.user = user;
      next();
    }

  } catch (error) {
    if (error.name === 'TokenExpiredError' && refreshTokenUs) {
      return res.redirect(`/users/refresh-token`);
    }
    res.redirect(`/users/login`);
  }

}