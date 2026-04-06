import { Request, Response } from "express";
import md5 from "md5";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import Account from "../../models/account.model";
import { systemConfig } from "../../config/config";
import Blacklist from "../../models/blacklist.model";
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
    req.flash("error", "Sai email");
    return res.redirect("back");
  }

  if (md5(password) !== user.password) {
    req.flash("error", "Sai mật khẩu");
    return res.redirect("back");
  }

  if (user.status === 'inactive') {
    req.flash('error', 'Tài khoản đã bị khóa');
    return res.redirect("back");
  }

  // Access Token: Dùng để xác thực các request (hết hạn nhanh, ví dụ: 15 phút).
  // Refresh Token: Dùng để lấy Access Token mới mà không cần đăng nhập lại (hết hạn lâu, ví dụ: 30 ngày).
  // Blacklist: Khi người dùng Logout, chúng ta lưu Access Token đó vào một danh sách "bị cấm" 
  // (thường dùng Redis vì tốc độ nhanh và có tự động xóa theo thời gian hết hạn của token).

  const payload = {
    id: user.id,
    role_id: user.role_id
  }
  const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_KEY!, { expiresIn: '2d' });

  const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_KEY!, { expiresIn: '30d' });
  res.cookie('token', accessToken, { httpOnly: true, path: '/admin/' });
  res.cookie('refreshToken', refreshToken, { httpOnly: true, path: '/admin/auth/refresh-token' });

  res.redirect(`/${systemConfig.prefixAdmin}/dashboard`);
}

//[GET] /admin/auth/login
export const logout = async (req: Request, res: Response) => {
  const token: string = req.cookies.token;
  const decode = jwt.decode(token);

  if (decode && typeof decode !== "string") {
    await Blacklist.create({
      token: token,
      expireAt: new Date(decode.exp! * 1000)
    });
  }
  res.clearCookie("token");
  res.clearCookie("refreshToken");
  res.redirect(`/${systemConfig.prefixAdmin}/auth/login`);
}

//[GET] /admin/auth/refresh-token
export const refreshToken = async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    res.redirect(`/${systemConfig.prefixAdmin}/auth/login`);
  }
  try {

    const decode = jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY!);
    if (decode && typeof decode !== "string") {
      const newAccessToken = jwt.sign(
        { id: decode.id!, role_id: decode.role_id! },
        process.env.JWT_ACCESS_KEY!,
        { expiresIn: '2d' } // Chỉ cho phép sống 15 phút
      );
      res.cookie('token', newAccessToken, { httpOnly: true, path: '/admin/' });

      res.redirect(req.get('Referer') || `/${systemConfig.prefixAdmin}/dashboard`);
    }

  } catch (error) {
    // Refresh Token hết hạn hoặc fake -> Bắt đăng nhập lại
    res.clearCookie("token");
    res.clearCookie("refreshToken");
    res.redirect(`/${systemConfig.prefixAdmin}/auth/login`);
  }
}

