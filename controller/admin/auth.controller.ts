import { Request, Response } from "express";
import md5 from "md5"
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import Account from "../../models/account.model";
import { systemConfig } from "../../config/config"
dotenv.config();

//[GET] /admin/auth/login
export const login = async (req: Request, res: Response) => {

  res.render("admin/pages/auth/login", {
    pageTitle: "Trang đang nhập",

  });
}

//[POST] /admin/auth/login
export const loginPost = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await Account.findOne({
    email: email,
    deleted: false
  });



  if (!user) {
    return res.redirect(req.get('Referer'));
  }

  if (md5(password) !== user.password) {
    return res.redirect(req.get('Referer'));
  }

  if (user.status === 'inactive') {
    return res.redirect(req.get('Referer'));
  }


  const userToken = jwt.sign({
    id: user.id,
    role_id: user.role_id

  }, process.env.JWT_ACCESS_KEY, { algorithm: 'HS256', expiresIn: '3h' });


  res.cookie('token', userToken);


  res.redirect(`/${systemConfig.prefixAdmin}/dashboard`);
}

//[GET] /admin/auth/login
export const logout = async (req: Request, res: Response) => {

  res.clearCookie("token");
  res.redirect(`/${systemConfig.prefixAdmin}/auth/login`);
}