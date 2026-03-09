import { Request, Response } from "express";
import Account from "../../models/account.model";

import { md5 } from "md5";
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
  const emailExist = await Account.findOne({
    _id: { $ne: res.locals.user.id },
    email: req.body.email,
    deleted: false,
  });
  console.log(emailExist);

  if (emailExist) {
    res.redirect(
      req.get("Referer") || `/${systemConfig.prefixAdmin}/my-account`,
    );
  } else {
    if (req.body.password) {
      req.body.password = md5(req.body.password);
    } else {
      delete req.body.password;
    }

    await Account.updateOne({ _id: res.locals.user.id }, req.body);
  }
  res.redirect(req.get("Referer") || `/${systemConfig.prefixAdmin}/my-account`);
};
