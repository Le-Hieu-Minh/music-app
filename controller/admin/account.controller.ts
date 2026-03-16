import { Request, Response } from "express";
import Account from "../../models/account.model";
import Role from "../../models/role.model";
import { systemConfig } from "../../config/config";
import md5 from "md5";

//[GET] /admin/accounts
export const index = async (req: Request, res: Response) => {

  const record = await Account.find({ deleted: false }).select("-password -token");

  for (const item of record) {
    const role = await Role.findOne({ _id: item.role_id, deleted: false });

    item['role'] = role;
  }

  res.render("admin/pages/accounts/index", {
    pageTitle: "Trang Accounts",
    record: record
  });
}

//[GET] /admin/accounts/create
export const create = async (req: Request, res: Response) => {
  const roles = await Role.find({ deleted: false })

  res.render("admin/pages/accounts/create", {
    pageTitle: "Trang Accounts",
    roles: roles
  });
}

//[POST] /admin/accounts/create
export const createPost = async (req: Request, res: Response) => {
  const existEmail = await Account.findOne({ email: req.body.email, deleted: false });
  if (existEmail) {
    res.redirect(req.get('Referer'));
  } else {
    req.body.password = md5(req.body.password);
    const newAccount = new Account(req.body);
    await newAccount.save();
    res.redirect(`/${systemConfig.prefixAdmin}/accounts`);
  }
}

//[GET] /admin/accounts/edit/:id
export const edit = async (req: Request, res: Response) => {
  const roles = await Role.find({ deleted: false })
  const account = await Account.findOne({ _id: req.params.id, deleted: false });

  res.render("admin/pages/accounts/edit", {
    pageTitle: "Trang sửa tài khoản",
    roles: roles,
    account: account
  });
}

//[POST] /admin/accounts/edit/:id
export const editPatch = async (req: Request, res: Response) => {
  const existEmail = await Account.findOne({
    _id: { $ne: req.params.id },
    email: req.body.email,
    deleted: false
  });

  if (existEmail) {
    res.redirect(req.get('Referer'));
  } else {
    if (req.body.password) {
      req.body.password = md5(req.body.password);
    } else {
      delete req.body.password;
    }
    await Account.updateOne({ _id: req.params.id }, req.body);

  }

  res.redirect(req.get('Referer'))
}

//[GET] /admin/accounts/detail/:id
export const detail = async (req: Request, res: Response) => {
  const detailAccount = await Account.findOne({ _id: req.params.id, deleted: false });
  const roleDetail = await Role.findOne({ _id: detailAccount.role_id, deleted: false }).select("title");
  res.render("admin/pages/accounts/detail", {
    pageTitle: "Trang sửa tài khoản",
    detailAccount: detailAccount,
    roleDetail: roleDetail
  });
}

//[DELETE] /admin/account/delete/:id
export const deleteItem = async (req: Request, res: Response) => {
  const id = req.params.id;

  const account = await Account.updateOne({ _id: id }, {
    deleted: true
  });
  if (account) {
    res.json({
      code: 200,
      message: "Xóa thành công",
    })
  }
}