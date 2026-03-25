import { Request, Response } from "express";
import User from "../../models/user.model";
import md5 from 'md5';
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import Blacklist from "../../models/blacklist.model";


dotenv.config();

//[GET] /users/register
export const register = async (req: Request, res: Response) => {
  res.render("client/pages/users/register", {
    pageTitle: "Đăng ký",
  });
}

//[POST] /users/register
export const registerPost = async (req: Request, res: Response) => {
  console.log(req.body);
  const existEmail = await User.findOne({ email: req.body.email });
  if (!existEmail) {
    req.body.password = md5(req.body.password);
    const user = new User(req.body);
    await user.save();
    res.redirect(`/users/login`);
  }
}

//[GET] /users/login
export const login = async (req: Request, res: Response) => {
  res.render("client/pages/users/login", {
    pageTitle: "Đăng nhập"
  });
}

//[POST] /users/login
export const loginPost = async (req: Request, res: Response) => {
  const user = await User.findOne({
    email: req.body.email,
    deleted: false
  });
  console.log(user);
  console.log(req.body);
  if (!user) {
    res.redirect(req.get(`Referer`));
  } else if (md5(req.body.password) !== user.password) {
    res.redirect(req.get(`Referer`));
  } else if (user.status === 'inactive') {
    res.redirect(req.get(`Referer`));
  }



  const payload = {
    id: user.id
  }
  const accessTokenUs = jwt.sign(payload, process.env.JWT_ACCESS_KEY, { expiresIn: '15m' });
  const refreshTokenUs = jwt.sign(payload, process.env.JWT_REFRESH_KEY, { expiresIn: '7d' });

  res.cookie('tokenUs', accessTokenUs, { httpOnly: true });
  res.cookie('refreshTokenUs', refreshTokenUs, { httpOnly: true, path: '/users/refresh-token' });
  res.redirect(`/topics`);
}

//[GET] /users/refresh-token
export const refreshToken = async (req: Request, res: Response) => {
  const refreshTokenUs = req.cookies.refreshTokenUs;
  if (!refreshTokenUs) {
    res.redirect(`/users/login`);
  } else {
    try {
      const decode = jwt.verify(refreshTokenUs, process.env.JWT_REFRESH_KEY)
      const newAccessTokenUs = jwt.sign({ id: decode.id }, process.env.JWT_ACCESS_KEY, { expiresIn: '15m' });
      res.cookie('tokenUs', newAccessTokenUs, { httpOnly: true });
      res.redirect(req.get(`Referer`) || `/topics`);
    } catch (error) {
      //neu het han hoac fake refreshToken
      res.clearCookie("tokenUs");
      res.clearCookie("refreshTokenUs");
      res.redirect(`/users/login`);
    }
  }
}

//[GET] /users/logout
export const logout = async (req: Request, res: Response) => {
  const tokenUs = req.cookies.tokenUs;
  if (tokenUs) {
    const decode = jwt.decode(tokenUs);
    await Blacklist.create({
      token: tokenUs,
      expireAt: new Date(decode.exp * 1000)
    });

  }
  res.clearCookie("tokenUs");
  res.clearCookie("refreshTokenUs");
  res.redirect(`/users/login`);
}




