import { Request, Response } from "express";
import User from "../../models/user.model";
import md5 from 'md5';
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
    pageTitle: "Đăng ký",
  });
}

//[POST] /users/register
export const registerPost = async (req: Request, res: Response) => {
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
  if (!user) {
    return res.redirect(req.get(`Referer`));
  } else if (md5(req.body.password) !== user.password) {
    return res.redirect(req.get(`Referer`));
  } else if (user.status === 'inactive') {
    return res.redirect(req.get(`Referer`));
  }



  const payload = {
    id: user.id
  }
  const accessTokenUs = jwt.sign(payload, process.env.JWT_ACCESS_KEY, { expiresIn: '2d' });
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
      const newAccessTokenUs = jwt.sign({ id: decode.id }, process.env.JWT_ACCESS_KEY, { expiresIn: '2d' });
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
  res.redirect(`/topics`);
}


//[GET] /users/fogot-password
export const forgotPassword = async (req: Request, res: Response) => {
  res.render("client/pages/users/fogot-password", {
    pageTitle: "Quên mật khẩu",
  });
}
//[POST] /users/fogot-password
export const forgotPasswordPost = async (req: Request, res: Response) => {
  const email = req.body.email;
  const otp = generateHelper.generateRandomNumber(8);
  const infoUser = await User.findOne({
    email: email,
    deleted: false
  });
  if (infoUser) {
    const data = {
      email: email,
      otp: otp,
      expireAt: Date.now()
    }
    const forgot = new ForgotPassword(data);
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
            Cảm ơn bạn đã đăng ký. Vui lòng sử dụng mã OTP dưới đây để hoàn tất quá trình xác thực. Mã này có hiệu lực trong <b>2 phút</b>.
          </p>
          
          <div style="display: inline-block; background-color: #f8f9fa; border: 1px dashed #007bff; padding: 15px 30px; border-radius: 4px;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #007bff;">${otp}</span>
          </div>
          
          <p style="font-size: 14px; color: #777777; margin-top: 30px;">
            Nếu bạn không yêu cầu mã này, vui lòng bỏ qua email này hoặc liên hệ với bộ phận hỗ trợ.
          </p>
        </td>
      </tr>
      
      <tr>
        <td style="padding: 20px; text-align: center; background-color: #eeeeee; color: #999999; font-size: 12px;">
          © 2026 Music App. All rights reserved.<br>
          Hà Nội, Việt Nam.
        </td>
      </tr>
    </table>
  </div>
`;
    sendEmailHelper.sendMail(email, subject, htmlContent);

    res.redirect(`/users/fogot-password/otp?email=${email}`);
  }
}


//[GET] /users/fogot-password/otp
export const otp = async (req: Request, res: Response) => {
  const email = req.query.email;
  res.render("client/pages/users/otp", {
    pageTitle: "Nhập mã otp lấy lại mật khẩu",
    email: email
  });
}


//[POST] /users/fogot-password/otp
export const otpPost = async (req: Request, res: Response) => {
  const email = req.body.email;
  const otp = req.body.otp;

  const result = await ForgotPassword.findOne({
    email: email,
    otp: otp
  });
  if (result) {
    const user = await User.findOne({
      email: email,
      deleted: false
    });
    if (user) {
      const tokenResetPW = jwt.sign({ id: user.id }, process.env.JWT_RESETPW_KEY, { expiresIn: '5m' });
      res.cookie('tokenResetPW', tokenResetPW, { httpOnly: true, path: "/users" });
      res.redirect(`/users/fogot-password/reset-password`);
    }
  }

}
//[GET] /users/fogot-password/reset-password
export const reset = async (req: Request, res: Response) => {
  res.render("client/pages/users/reset", {
    pageTitle: "Nhập mật khẩu",
  });
}


//[POST] /users/fogot-password/reset-password
export const resetPost = async (req: Request, res: Response) => {
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  const tokenResetPW = req.cookies.tokenResetPW;

  if (password === confirmPassword) {
    const decode = jwt.decode(tokenResetPW);
    await User.updateOne({
      _id: decode.id
    }, {
      password: md5(password)
    });
    res.clearCookie("tokenResetPW");
    res.redirect(`/users/login`);
  } else {
    res.redirect("/users/fogot-password");
  }
}




