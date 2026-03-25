import { Request, Response, NextFunction } from "express";
import Account from "../../models/account.model";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

import { systemConfig } from "../../config/config";
import Role from "../../models/role.model";
import Blacklist from "../../models/blacklist.model";

dotenv.config();
export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.token;
  const refreshToken = req.cookies.refreshToken;

  if (!token) return res.redirect(`/${systemConfig.prefixAdmin}/auth/login`);

  const isBlacklisted = await Blacklist.findOne({ token: token });
  if (isBlacklisted) {
    return res.redirect(`/${systemConfig.prefixAdmin}/auth/login`);
  }

  try {
    const decode = jwt.verify(token, process.env.JWT_ACCESS_KEY);
    const user = await Account.findOne({ _id: decode.id }).select('-password');
    const role = await Role.findOne({ _id: decode.role_id });
    if (!user) return res.redirect(`/${systemConfig.prefixAdmin}/auth/login`);

    res.locals.user = user;
    res.locals.role = role;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError' && refreshToken) {
      return res.redirect(`/${systemConfig.prefixAdmin}/auth/refresh-token`);
    }
    res.redirect(`/${systemConfig.prefixAdmin}/auth/login`);
  }

};
