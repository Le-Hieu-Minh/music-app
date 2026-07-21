import { Request, Response } from "express";
import User from "../../models/user.model";
import { systemConfig } from "../../config/config";
import { getPagination } from "../../helper/pagination";

//[GET] /admin/users
export const index = async (req: Request, res: Response) => {
  const keyword = ((req.query.keyword as string) || "").trim();
  const filter: any = { deleted: false };

  if (keyword) {
    filter.$or = [
      { fullName: new RegExp(keyword, "i") },
      { email: new RegExp(keyword, "i") }
    ];
  }

  const total = await User.countDocuments(filter);
  const pagination = getPagination(
    { page: req.query.page as string },
    total,
    10
  );

  const users = await User.find(filter)
    .select("-password")
    .sort({ createdAt: -1 })
    .skip(pagination.skip)
    .limit(pagination.limit);

  res.render("admin/pages/users/index", {
    pageTitle: "Tài khoản người dùng",
    users,
    keyword,
    pagination
  });
};

//[GET] /admin/users/detail/:id
export const detail = async (req: Request, res: Response) => {
  const user = await User.findOne({
    _id: req.params.id,
    deleted: false
  }).select("-password");

  if (!user) {
    return res.redirect(`/${systemConfig.prefixAdmin}/users`);
  }

  res.render("admin/pages/users/detail", {
    pageTitle: "Chi tiết người dùng",
    userDetail: user
  });
};

//[PATCH] /admin/users/changeStatus/:status/:id
export const changeStatus = async (req: Request, res: Response) => {
  try {
    await User.updateOne(
      { _id: req.params.id },
      { status: req.params.status }
    );
    res.json({
      code: 200,
      message: "Thay đổi trạng thái thành công"
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Thay đổi trạng thái thất bại"
    });
  }
};

//[PATCH] /admin/users/delete/:id
export const deleteItem = async (req: Request, res: Response) => {
  try {
    await User.updateOne(
      { _id: req.params.id },
      { deleted: true, deleteAt: new Date() }
    );
    res.json({
      code: 200,
      message: "Xóa thành công"
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Xóa thất bại"
    });
  }
};
