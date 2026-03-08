import { Request, Response } from "express";
import Singer from "../../models/singer.model";
import { systemConfig } from "../../config/config";

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
  console.log(req.body);
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

  res.redirect(`/${systemConfig.prefixAdmin}/singers`);

}

//[GET] /admin/singers/edit
export const edit = async (req: Request, res: Response) => {
  const id = req.params.id;
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

  const id = req.params.id;

  const dataSingers = {
    fullName: req.body.fullName,

    status: req.body.status,

  }
  if (req.body.avatar) {
    dataSingers["avatar"] = req.body.avatar[0];
  }

  await Singer.updateOne({
    _id: id
  }, dataSingers);

  res.redirect(req.get('Referer'));
}

//[DELETE] /admin/singers/delete/:id
export const deleteItem = async (req: Request, res: Response) => {
  const id = req.params.id;

  const singer = await Singer.updateOne({ _id: id }, {
    deleted: true
  });


  res.json({
    code: 200,
    message: "Xóa thành công",
  })
}

//[GET] /admin/singers/detail/:id
export const detail = async (req: Request, res: Response) => {
  const id = req.params.id;

  const detailSinger = await Singer.findOne({ _id: id });

  res.render("admin/pages/singers/detail", {
    detailSinger: detailSinger
  });
}

//[PATCH] /admin/singers/changeStatus/:status/:id
export const changeStatus = async (req: Request, res: Response) => {
  const id = req.params.id;
  const status = req.params.status;
  await Singer.updateOne({ _id: id }, {
    status: status
  });
  res.json({
    code: 200,
    message: "Thay đổi status thành công!"
  })
};


