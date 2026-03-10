import { Request, Response } from "express";
import Topic from "../../models/topic.model";
import { systemConfig } from "../../config/config";

//[GET] /admin/topics
export const topics = async (req: Request, res: Response) => {

  const topics = await Topic.find({
    deleted: false
  });



  res.render("admin/pages/topics/index", {
    pageTitle: "Chủ đề bài hát",
    topics: topics
  });
}

//[GET] /admin/topics/create
export const create = async (req: Request, res: Response) => {


  res.render("admin/pages/topics/create", {
    pageTitle: "Thêm chủ đề",
  });
}
//[POST] /admin/topics/create
export const createPost = async (req: Request, res: Response) => {
  console.log(req.body);
  let avatar: string = "";

  if (req.body.avatar) {
    avatar = req.body.avatar[0];
  }


  const dataTopics = {
    title: req.body.title,
    avatar: avatar,
    description: req.body.description,
    status: req.body.status

  }
  const topic = new Topic(dataTopics);
  await topic.save();

  res.redirect(`/${systemConfig.prefixAdmin}/topics`);

}

//[GET] /admin/topics/edit
export const edit = async (req: Request, res: Response) => {
  const id = req.params.id;
  const topic = await Topic.findOne({
    _id: id, deleted: false
  })

  res.render("admin/pages/topics/edit", {
    pageTitle: "Sửa topic",
    topic: topic
  });

}


//[PATCH] /admin/topics/editPatch
export const editPatch = async (req: Request, res: Response) => {

  const id = req.params.id;

  const dataTopic = {
    title: req.body.title,

    description: req.body.description,
    status: req.body.status,

  }
  if (req.body.avatar) {
    dataTopic["avatar"] = req.body.avatar[0];
  }

  await Topic.updateOne({
    _id: id
  }, dataTopic);

  res.redirect(req.get('Referer'));
}

//[DELETE] /admin/topics/delete/:id
export const deleteItem = async (req: Request, res: Response) => {
  const id = req.params.id;

  const topic = await Topic.updateOne({ _id: id }, {
    deleted: true
  });
  if (topic) {
    res.json({
      code: 200,
      message: "Xóa thành công",
    })
  }
}

//[DELETE] /admin/topics/detail/:id
export const detail = async (req: Request, res: Response) => {
  const id = req.params.id;

  const detailTopic = await Topic.findOne({ _id: id });

  res.render("admin/pages/topics/detail", {
    detailTopic: detailTopic
  });
}

//[PATCH] /admin/topics/changeStatus/:status/:id
export const changeStatus = async (req: Request, res: Response) => {
  const id = req.params.id;
  const status = req.params.status;
  await Topic.updateOne({ _id: id }, {
    status: status
  });
  res.json({
    code: 200,
    message: "Thay đổi status thành công!"
  })
};


