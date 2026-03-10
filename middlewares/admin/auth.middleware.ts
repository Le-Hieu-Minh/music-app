import { Request, Response, NextFunction } from "express";
import Account from "../../models/account.model";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
// const Role = require('../../models/role.model')

import { systemConfig } from "../../config/config";
import Role from "../../models/role.model";

dotenv.config();
export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.cookies.token) {
    res.redirect(`/${systemConfig.prefixAdmin}/auth/login`);
  } else {
    const decode = jwt.verify(req.cookies.token, process.env.JWT_ACCESS_KEY);

    const user = await Account.findOne({ _id: decode.id }).select("-password");
    const role = await Role.findOne({ _id: decode.role_id });

    if (!user) {
      res.redirect(`/${systemConfig.prefixAdmin}/auth/login`);
    } else {
      res.locals.user = user;
      res.locals.role = role;
      next();
    }
  }
};
