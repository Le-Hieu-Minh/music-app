import { Request, Response } from "express";
import Role from "../../models/role.model";
import { systemConfig } from "../../config/config";

interface SongData {
  title: string;
  description: string;
}

//[GET] /admin/roles
export const index = async (req: Request, res: Response) => {
  const record = await Role.find({ deleted: false });


  res.render("admin/pages/role/index", {
    pageTitle: "Nhóm quyền",
    record: record
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
  try {
    const data: SongData = {
      title: req.body.title,
      description: req.body.description
    }
    const newRole = new Role(data)
    await newRole.save();
    req.flash("success", "Tạo mới thành công");
    res.redirect(`/${systemConfig.prefixAdmin}/roles`);
  } catch (error) {
    req.flash("error", "Tạo mới thất bại");
    res.redirect(`/${systemConfig.prefixAdmin}/roles`);
  }

};


//[GET] /admin/roles/edit/:id
export const edit = async (req: Request, res: Response) => {
  const roleCreate = await Role.findOne({ _id: req.params.id, deleted: false });

  res.render("admin/pages/role/edit", {
    pageTitle: "Sửa quyền",
    roleCreate: roleCreate
  });
};


//[PATCH] /admin/roles/editPatch/:id
export const editPatch = async (req: Request, res: Response) => {
  try {
    await Role.updateOne({ _id: req.params.id }, req.body);
    req.flash("success", "Sửa thành công");
    res.redirect(`/${systemConfig.prefixAdmin}/roles`);
  } catch (error) {
    req.flash("error", "Sửa thất bại");
    res.redirect(`/${systemConfig.prefixAdmin}/roles`);
  }

};


//[PATCH] /admin/roles/deleteItem/:id
export const deleteItem = async (req: Request, res: Response) => {
  try {
    const deleteRole = await Role.updateOne({ _id: req.params.id }, { deleted: true });
    if (deleteRole) {
      req.flash("success", "Xóa thành công");
      res.json({
        code: 200,
        message: "Xóa thành công"
      });
    }
  } catch (error) {
    req.flash("error", "Xóa thất bại");
    res.redirect(`/${systemConfig.prefixAdmin}/roles`);
  }
};


//[GET] /admin/roles/premissions/:id
export const premission = async (req: Request, res: Response) => {
  const record = await Role.find({ deleted: false });
  res.render("admin/pages/role/permissions", {
    pageTitle: "Phân quyền",
    record: record
  });
};

//[PATCH] /admin/roles/premissions/:id
export const permissionsPatch = async (req: Request, res: Response) => {
  try {
    const premissions = req.body;
    for (const item of premissions) {
      await Role.updateOne({ _id: item.id }, { permissions: item.permissions });
    }
    req.flash("success", "Sửa thành công");
    res.redirect("back");
  } catch (error) {
    req.flash("error", "Sửa thất bại");
    res.redirect("back");
  }
};



//  if(role.permissions.includes('roles_premissions'))
