import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';
import User from "../../models/user.model";


export const userInfo = async (req: Request, res: Response, next: NextFunction) => {
  const tokenUs = req.cookies.tokenUs;
  if (tokenUs) {
    const decode = jwt.decode(tokenUs);
    const custummer = await User.findOne({
      _id: decode.id,
      deleted: false
    }).select('-password');
    res.locals.custummer = custummer;
  }
  next();
}