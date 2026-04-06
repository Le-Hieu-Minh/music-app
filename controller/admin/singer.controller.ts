import { Request, Response } from "express";
import Singer from "../../models/singer.model";
import { systemConfig } from "../../config/config";

interface SingerData {
  fullName: string;
  status: string;
  avatar?: string;
}

//[GET] /admin/singers
export const index = async (req: Request, res: Response) => {

  const singers = await Singer.find({
    deleted: false
  });

  res.render("admin/pages/singers/index", {
    pageTitle: "Ca sỹ",
    singers: singers
  });
}

//[GET] /admin/singers/create
export const create = async (req: Request, res: Response) => {
  res.render("admin/pages/singers/create", {
    pageTitle: "Thêm ca sỹ",
  });
}

//[POST] /admin/singers/create
export const createPost = async (req: Request, res: Response) => {
  try {
    let avatar: string = "";

    if (req.body.avatar) {
      avatar = req.body.avatar[0];
    }

    const dataSingers = {
      fullName: req.body.fullName,
      avatar: avatar,
      status: req.body.status

    }
    const singer = new Singer(dataSingers);
    await singer.save();
    req.flash("success", "Thêm mới thành công")
    res.redirect(`/${systemConfig.prefixAdmin}/singers`);
  } catch (error) {
    req.flash("error", "Thêm mới thất bại")
    res.redirect(`/${systemConfig.prefixAdmin}/singers`);
  }

}

//[GET] /admin/singers/edit
export const edit = async (req: Request, res: Response) => {
  const id: string = req.params.id;
  const singers = await Singer.findOne({
    _id: id, deleted: false
  })

  res.render("admin/pages/singers/edit", {
    pageTitle: "Sửa ca sỹ",
    singers: singers
  });

}


//[PATCH] /admin/singers/editPatch
export const editPatch = async (req: Request, res: Response) => {
  try {
    const id: string = req.params.id;

    const dataSingers: SingerData = {
      fullName: req.body.fullName,
      status: req.body.status,
    }
    if (req.body.avatar) {
      dataSingers.avatar = req.body.avatar[0];
    }

    await Singer.updateOne({
      _id: id
    }, dataSingers);
    req.flash("success", "Sửa thành công");
    res.redirect(req.get('Referer') || `/${systemConfig.prefixAdmin}/singers`);
  } catch (error) {
    req.flash("error", "Sửa thất bại");
    res.redirect(req.get('Referer') || `/${systemConfig.prefixAdmin}/singers`);
  }

}

//[DELETE] /admin/singers/delete/:id
export const deleteItem = async (req: Request, res: Response) => {
  try {
    const id: string = req.params.id;
    const singer = await Singer.updateOne({ _id: id }, {
      deleted: true
    });
    if (singer) {
      req.flash("success", "Xóa thành công");
      res.json({
        code: 200,
        message: "Xóa thành công",
      })
    }
  } catch (error) {
    req.flash("error", "Xóa thất bại");
    res.redirect(`/${systemConfig.prefixAdmin}/singers`);
  }

}

//[GET] /admin/singers/detail/:id
export const detail = async (req: Request, res: Response) => {
  const id: string = req.params.id;

  const detailSinger = await Singer.findOne({ _id: id });

  res.render("admin/pages/singers/detail", {
    detailSinger: detailSinger
  });
}

//[PATCH] /admin/singers/changeStatus/:status/:id
export const changeStatus = async (req: Request, res: Response) => {
  try {
    const id: string = req.params.id;
    const status: string = req.params.status;
    await Singer.updateOne({ _id: id }, {
      status: status
    });
    req.flash("success", "Thay đổi trạng thái thành công");
    res.json({
      code: 200,
      message: "Thay đổi status thành công!"
    })
  } catch (error) {
    req.flash("error", "Thay đổi trạng thất bại");
    res.redirect(`/${systemConfig.prefixAdmin}/singers`);
  }

};


