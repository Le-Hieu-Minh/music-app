import { Request, Response } from "express";
import Topic from "../../models/topic.model";
import Song from "../../models/song.model";
import Singer from "../../models/singer.model";
import FavoriteSong from "../../models/favorite-song.model";
import { systemConfig } from "../../config/config";


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


//[GET] /admin/create
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

//[POST] /admin/createPost
export const createPost = async (req: Request, res: Response) => {
  let avatar: string = "";
  let audio: string = "";
  if (req.body.avatar) {
    avatar = req.body.avatar[0];
  }
  if (req.body.audio) {
    audio = req.body.audio[0];
  }


  const dataSong = {
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
  res.redirect(`/${systemConfig.prefixAdmin}/songs`);
};

//[GET] /admin/edit/:id
export const edit = async (req: Request, res: Response) => {
  const id = req.params.id;

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
  const id = req.params.id;






  const dataSong = {
    title: req.body.title,
    topicId: req.body.topicId,
    singerId: req.body.singerId,
    description: req.body.description,
    status: req.body.status,
    lyrics: req.body.lyrics
  }
  if (req.body.avatar) {
    dataSong["avatar"] = req.body.avatar[0];
  }
  if (req.body.audio) {
    dataSong["audio"] = req.body.audio[0];
  }
  await Song.updateOne({
    _id: id
  }, dataSong);

  res.redirect(req.get('Referer'))
};