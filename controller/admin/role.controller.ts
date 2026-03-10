import { Request, Response } from "express";
import Role from "../../models/role.model";
import { systemConfig } from "../../config/config";


//[GET] /admin/roles
export const index = async (req: Request, res: Response) => {
  const role = await Role.find({ deleted: false });


  res.render("admin/pages/role/index", {
    pageTitle: "Nhóm quyền",
    role: role
  });
};
//[GET] /admin/roles/detail/:id
export const detail = async (req: Request, res: Response) => {
  const detailRole = await Role.findOne({ _id: req.params.id, deleted: false });
  res.render("admin/pages/role/detail", {
    pageTitle: "Thông tin Role",
    detailRole: detailRole
  });
};

//[GET] /admin/roles/create
export const create = async (req: Request, res: Response) => {
  res.render("admin/pages/role/create", {
    pageTitle: "Tạo quyền mới"
  });
};

//[POST] /admin/roles/createPost
export const createPost = async (req: Request, res: Response) => {
  const data = {
    title: req.body.title,
    description: req.body.description
  }
  const newRole = new Role(data)
  newRole.save();

  res.redirect(`/${systemConfig.prefixAdmin}/roles`)
};


//[GET] /admin/roles/edit/:id
export const edit = async (req: Request, res: Response) => {
  const role = await Role.findOne({ _id: req.params.id, deleted: false });
  console.log(role);

  res.render("admin/pages/role/edit", {
    pageTitle: "Sửa quyền",
    role: role
  });
};


//[PATCH] /admin/roles/editPatch/:id
export const editPatch = async (req: Request, res: Response) => {
  await Role.updateOne({ _id: req.params.id }, req.body);
  res.redirect(`/${systemConfig.prefixAdmin}/roles`)
};


//[PATCH] /admin/roles/deleteItem/:id
export const deleteItem = async (req: Request, res: Response) => {
  const deleteRole = await Role.updateOne({ _id: req.params.id }, { deleted: true });
  if (deleteRole) {
    res.json({
      code: 200,
      message: "Xóa thành công"
    })
  }
};
