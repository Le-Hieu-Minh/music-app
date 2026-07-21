import { Request, Response } from "express";
import User from "../../models/user.model";
import md5 from "md5";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import Blacklist from "../../models/blacklist.model";
import * as generateHelper from "../../helper/generate";
import * as sendEmailHelper from "../../helper/sendEmail";
import ForgotPassword from "../../models/forgot-password.model";

dotenv.config();

//[GET] /users/register
export const register = async (req: Request, res: Response) => {
  res.render("client/pages/users/register", {
    pageTitle: "Đăng ký"
  });
};

//[POST] /users/register
export const registerPost = async (req: Request, res: Response) => {
  const existEmail = await User.findOne({
    email: req.body.email,
    deleted: false
  });

  if (existEmail) {
    req.flash("error", "Email đã tồn tại");
    return res.redirect(req.get("Referer") || "/users/register");
  }

  if (!req.body.fullName || !req.body.email || !req.body.password) {
    req.flash("error", "Vui lòng điền đầy đủ thông tin");
    return res.redirect(req.get("Referer") || "/users/register");
  }

  req.body.password = md5(req.body.password);
  const user = new User({
    fullName: req.body.fullName,
    email: req.body.email,
    password: req.body.password
  });
  await user.save();

  req.flash("success", "Đăng ký thành công, vui lòng đăng nhập");
  res.redirect(`/users/login`);
};

//[GET] /users/login
export const login = async (req: Request, res: Response) => {
  res.render("client/pages/users/login", {
    pageTitle: "Đăng nhập"
  });
};

//[POST] /users/login
export const loginPost = async (req: Request, res: Response) => {
  const user = await User.findOne({
    email: req.body.email,
    deleted: false
  });

  if (!user) {
    req.flash("error", "Email không tồn tại");
    return res.redirect(req.get("Referer") || `/users/login`);
  }

  if (md5(req.body.password) !== user.password) {
    req.flash("error", "Mật khẩu không đúng");
    return res.redirect(req.get("Referer") || `/users/login`);
  }

  if (user.status === "inactive") {
    req.flash("error", "Tài khoản đã bị khóa");
    return res.redirect(req.get("Referer") || `/users/login`);
  }

  const payload = { id: user.id };
  const accessTokenUs = jwt.sign(payload, process.env.JWT_ACCESS_KEY!, { expiresIn: "2d" });
  const refreshTokenUs = jwt.sign(payload, process.env.JWT_REFRESH_KEY!, { expiresIn: "7d" });

  res.cookie("tokenUs", accessTokenUs, { httpOnly: true });
  res.cookie("refreshTokenUs", refreshTokenUs, {
    httpOnly: true,
    path: "/users/refresh-token"
  });
  res.redirect(`/`);
};

//[GET] /users/refresh-token
export const refreshToken = async (req: Request, res: Response) => {
  const refreshTokenUs = req.cookies.refreshTokenUs;

  if (!refreshTokenUs) {
    return res.redirect(`/users/login`);
  }

  try {
    const decode: any = jwt.verify(refreshTokenUs, process.env.JWT_REFRESH_KEY!);
    const newAccessTokenUs = jwt.sign(
      { id: decode.id },
      process.env.JWT_ACCESS_KEY!,
      { expiresIn: "2d" }
    );
    res.cookie("tokenUs", newAccessTokenUs, { httpOnly: true });
    res.redirect(req.get("Referer") || `/`);
  } catch (error) {
    res.clearCookie("tokenUs");
    res.clearCookie("refreshTokenUs", { path: "/users/refresh-token" });
    res.redirect(`/users/login`);
  }
};

//[GET] /users/logout
export const logout = async (req: Request, res: Response) => {
  const tokenUs = req.cookies.tokenUs;

  if (tokenUs) {
    try {
      const decode: any = jwt.decode(tokenUs);
      if (decode && decode.exp) {
        await Blacklist.create({
          token: tokenUs,
          expireAt: new Date(decode.exp * 1000)
        });
      }
    } catch (error) {
      // ignore
    }
  }

  res.clearCookie("tokenUs");
  res.clearCookie("refreshTokenUs", { path: "/users/refresh-token" });
  res.redirect(`/`);
};

//[GET] /users/info
export const info = async (req: Request, res: Response) => {
  const user = res.locals.user;
  res.render("client/pages/users/info", {
    pageTitle: "Thông tin tài khoản",
    userInfo: user
  });
};

//[GET] /users/edit
export const edit = async (req: Request, res: Response) => {
  const user = res.locals.user;
  res.render("client/pages/users/edit", {
    pageTitle: "Sửa thông tin",
    userInfo: user
  });
};

//[POST] /users/edit
export const editPost = async (req: Request, res: Response) => {
  const user = res.locals.user;

  if (!req.body.fullName || !req.body.fullName.trim()) {
    req.flash("error", "Họ tên không được để trống");
    return res.redirect(req.get("Referer") || "/users/edit");
  }

  const updateData: any = {
    fullName: req.body.fullName.trim()
  };

  if (req.body.password) {
    updateData.password = md5(req.body.password);
  }

  await User.updateOne({ _id: user.id }, updateData);
  req.flash("success", "Cập nhật thành công");
  res.redirect("/users/info");
};

//[GET] /users/fogot-password
export const forgotPassword = async (req: Request, res: Response) => {
  res.render("client/pages/users/fogot-password", {
    pageTitle: "Quên mật khẩu"
  });
};

//[POST] /users/fogot-password
export const forgotPasswordPost = async (req: Request, res: Response) => {
  const email = req.body.email;
  const infoUser = await User.findOne({
    email: email,
    deleted: false,
    status: "active"
  });

  if (!infoUser) {
    req.flash("error", "Email không tồn tại trong hệ thống");
    return res.redirect(req.get("Referer") || "/users/fogot-password");
  }

  const otp = generateHelper.generateRandomNumber(8);
  const forgot = new ForgotPassword({
    email: email,
    otp: otp,
    expireAt: Date.now()
  });
  await forgot.save();

  const subject = `Mã OTP lấy lại mật khẩu`;
  const htmlContent = `
  <div style="background-color: #f4f4f4; padding: 20px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
    <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
      <tr>
        <td style="padding: 40px 20px; text-align: center; background-color: #007bff;">
          <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Xác thực tài khoản</h1>
        </td>
      </tr>
      <tr>
        <td style="padding: 40px 30px; text-align: center;">
          <p style="font-size: 16px; color: #333333; line-height: 1.5; margin-bottom: 30px;">
            Chào bạn <b>${email}</b>,<br>
            Vui lòng sử dụng mã OTP dưới đây để lấy lại mật khẩu. Mã có hiệu lực trong <b>2 phút</b>.
          </p>
          <div style="display: inline-block; background-color: #f8f9fa; border: 1px dashed #007bff; padding: 15px 30px; border-radius: 4px;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #007bff;">${otp}</span>
          </div>
        </td>
      </tr>
      <tr>
        <td style="padding: 20px; text-align: center; background-color: #eeeeee; color: #999999; font-size: 12px;">
          © 2026 Music App. All rights reserved.
        </td>
      </tr>
    </table>
  </div>
`;

  try {
    await sendEmailHelper.sendMail(email, subject, htmlContent);
  } catch (error) {
    req.flash("error", "Không gửi được email, vui lòng thử lại");
    return res.redirect(req.get("Referer") || "/users/fogot-password");
  }

  res.redirect(`/users/fogot-password/otp?email=${encodeURIComponent(email)}`);
};

//[GET] /users/fogot-password/otp
export const otp = async (req: Request, res: Response) => {
  const email = req.query.email;
  res.render("client/pages/users/otp", {
    pageTitle: "Nhập mã OTP",
    email: email
  });
};

//[POST] /users/fogot-password/otp
export const otpPost = async (req: Request, res: Response) => {
  const email = req.body.email;
  const otp = req.body.otp;

  const result = await ForgotPassword.findOne({
    email: email,
    otp: otp
  });

  if (!result) {
    req.flash("error", "OTP không đúng hoặc đã hết hạn");
    return res.redirect(`/users/fogot-password/otp?email=${encodeURIComponent(email)}`);
  }

  const user = await User.findOne({
    email: email,
    deleted: false
  });

  if (!user) {
    req.flash("error", "Không tìm thấy tài khoản");
    return res.redirect("/users/fogot-password");
  }

  const tokenResetPW = jwt.sign(
    { id: user.id },
    process.env.JWT_RESETPW_KEY!,
    { expiresIn: "5m" }
  );
  res.cookie("tokenResetPW", tokenResetPW, { httpOnly: true, path: "/users" });
  res.redirect(`/users/fogot-password/reset-password`);
};

//[GET] /users/fogot-password/reset-password
export const reset = async (req: Request, res: Response) => {
  res.render("client/pages/users/reset", {
    pageTitle: "Đặt lại mật khẩu"
  });
};

//[POST] /users/fogot-password/reset-password
export const resetPost = async (req: Request, res: Response) => {
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  const tokenResetPW = req.cookies.tokenResetPW;

  if (!tokenResetPW) {
    req.flash("error", "Phiên đặt lại mật khẩu không hợp lệ");
    return res.redirect("/users/fogot-password");
  }

  if (!password || password !== confirmPassword) {
    req.flash("error", "Mật khẩu xác nhận không khớp");
    return res.redirect("/users/fogot-password/reset-password");
  }

  try {
    const decode: any = jwt.verify(tokenResetPW, process.env.JWT_RESETPW_KEY!);
    await User.updateOne(
      { _id: decode.id },
      { password: md5(password) }
    );
    res.clearCookie("tokenResetPW", { path: "/users" });
    req.flash("success", "Đổi mật khẩu thành công");
    res.redirect(`/users/login`);
  } catch (error) {
    req.flash("error", "Token hết hạn hoặc không hợp lệ");
    res.redirect("/users/fogot-password");
  }
};
