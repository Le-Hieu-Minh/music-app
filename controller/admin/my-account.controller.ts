import { Request, Response } from "express";
import Account from "../../models/account.model";

import md5 from "md5";
import { systemConfig } from "../../config/config";

// [GET] /admin/my-account
export const index = async (req: Request, res: Response) => {
  res.render("admin/pages/my-account/index", {
    pageTitle: "Thong tin tai khoan",
  });
};

// [GET] /admin/my-account
export const edit = async (req: Request, res: Response) => {
  res.render("admin/pages/my-account/edit", {
    pageTitle: "Thong tin tai khoan",
  });
};

// [PATCH] /admin/my-account/edit
export const editPatch = async (req: Request, res: Response) => {
  try {
    const emailExist = await Account.findOne({
      _id: { $ne: res.locals.user.id },
      email: req.body.email,
      deleted: false,
    });

    if (emailExist) {
      req.flash("error", "Email này đã tồn tại");
      res.redirect(req.get("Referer") || `/${systemConfig.prefixAdmin}/my-account`);
    } else {
      if (req.body.password) {
        req.body.password = md5(req.body.password);
      } else {
        delete req.body.password;
      }
      req.flash("success", "Sửa thành công");
      await Account.updateOne({ _id: res.locals.user.id }, req.body);
    }
    res.redirect(req.get("Referer") || `/${systemConfig.prefixAdmin}/my-account`);
  } catch (error) {
    req.flash("error", "Sửa thất bại");
    res.redirect(req.get("Referer") || `/${systemConfig.prefixAdmin}/my-account`);
  }
};
