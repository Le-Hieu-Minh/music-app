import { Request, Response } from "express";
import Topic from "../../models/topic.model";
import Song from "../../models/song.model";
import Singer from "../../models/singer.model";
import { systemConfig } from "../../config/config";

export interface SongData {
  title: string;
  topicId: string;
  singerId: string;
  description?: string;
  status: string;
  lyrics?: string;
  avatar?: string;
  audio?: string;
}
//[GET] /admin/songs
export const index = async (req: Request, res: Response) => {

  const songs = await Song.find({
    deleted: false
  });


  res.render("admin/pages/songs/index", {
    pageTitle: "Danh sách bài hát",
    songs: songs
  });
};


//[GET] /admin/songs/create
export const create = async (req: Request, res: Response) => {

  const topics = await Topic.find({
    deleted: false,
    status: "active"
  }).select("title");

  const singers = await Singer.find({
    deleted: false,

  }).select("fullName");


  res.render("admin/pages/songs/create", {
    pageTitle: "Danh sách bài hát",
    topics: topics,
    singers: singers
  });
};

//[POST] /admin/songs/createPost
export const createPost = async (req: Request, res: Response) => {
  try {
    let avatar: string = "";
    let audio: string = "";
    if (req.body.avatar) {
      avatar = req.body.avatar[0];
    }
    if (req.body.audio) {
      audio = req.body.audio[0];
    }


    const dataSong: SongData = {
      title: req.body.title,
      topicId: req.body.topicId,
      singerId: req.body.singerId,
      description: req.body.description,
      status: req.body.status,
      avatar: avatar,
      audio: audio,
      lyrics: req.body.lyrics
    }

    const song = new Song(dataSong);
    await song.save();
    req.flash("success", "Thêm mới thành công");
    res.redirect(`/${systemConfig.prefixAdmin}/songs`);
  } catch (error) {
    req.flash("error", "Thêm mới thành công");
    res.redirect(`/${systemConfig.prefixAdmin}/songs`);
  }

};

//[GET] /admin/edit/:id
export const edit = async (req: Request, res: Response) => {
  const id: string = req.params.id;

  const song = await Song.findOne({
    _id: id,
    deleted: false
  });

  const topics = await Topic.find({
    deleted: false
  }).select("title");

  const singers = await Singer.find({
    deleted: false
  }).select("fullName");

  res.render("admin/pages/songs/edit", {
    pageTitle: "Chỉnh sửa bài hát",
    song: song,
    topics: topics,
    singers: singers
  });
};

//[Patch] /admin/editPatch
export const editPatch = async (req: Request, res: Response) => {
  try {
    const id: string = req.params.id;

    const dataSong: SongData = {
      title: req.body.title,
      topicId: req.body.topicId,
      singerId: req.body.singerId,
      description: req.body.description,
      status: req.body.status,
      lyrics: req.body.lyrics
    }
    if (req.body.avatar) {
      dataSong.avatar = req.body.avatar[0];
    }
    if (req.body.audio) {
      dataSong.audio = req.body.audio[0];
    }
    await Song.updateOne({
      _id: id
    }, dataSong);
    req.flash("success", "Sửa thành công");
    res.redirect(req.get('Referer') || `/${systemConfig.prefixAdmin}/songs`);
  } catch (error) {
    req.flash("error", "Sửa thất bại");
    res.redirect(req.get('Referer') || `/${systemConfig.prefixAdmin}/songs`);
  }

};

//[Patch] /admin/editPatch
export const deleteItem = async (req: Request, res: Response) => {
  try {
    const id: string = req.params.id;

    const song = await Song.updateOne({ _id: id }, {
      deleted: true,
    });
    req.flash("success", "Xóa thành công");
    if (song) {
      res.json({
        code: 200,
        message: "Xóa thành công",
        song: song
      })
    }
  } catch (error) {
    req.flash("error", "Xóa thất bại");
    res.redirect(req.get('Referer') || `/${systemConfig.prefixAdmin}/songs`);
  }
};


//[GET] /admin/detail/:id
export const detail = async (req: Request, res: Response) => {
  const id: string = req.params.id;
  const detailSong = await Song.findOne({ _id: id });

  res.render("admin/pages/songs/detail", {
    detailSong: detailSong
  });
};

//[PATCH] /admin/songs/changeStatus/:status/:id
export const changeStatus = async (req: Request, res: Response) => {
  try {
    const id: string = req.params.id;
    const status = req.params.status;
    await Song.updateOne({ _id: id }, {
      status: status
    });
    req.flash("success", "Thay đổi status thành công");
    res.json({
      code: 200,
      message: "Thay đổi status thành công!"
    });
  } catch (error) {
    req.flash("error", "Thay đổi status thất bại");
    res.redirect(req.get('Referer') || `/${systemConfig.prefixAdmin}/songs`);
  }

};
