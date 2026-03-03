import { Request, Response } from "express";
import Topic from "../../models/topic.model";
import Song from "../../models/song.model";
import Singer from "../../models/singer.model";
import FavoriteSong from "../../models/favorite-song.model";


//[GET] /songs/:slugTopic
export const list = async (req: Request, res: Response) => {

  const topic = await Topic.findOne({
    slug: req.params.slugTopic,
    status: "active",
    deleted: false
  });
  const songs = await Song.find({
    topicId: topic.id,
    status: "active",
    deleted: false
  }).select("avatar title slug like singerId");


  for (const song of songs) {
    const infoSinger = await Singer.findOne({
      _id: song.singerId,
      status: "active",
      deleted: false
    })
    song["infoSinger"] = infoSinger;
  }


  res.render("client/pages/songs/list", {
    pageTitle: topic.title,
    songs: songs
  });
};

//[GET] /songs/:slugSong
export const detail = async (req: Request, res: Response) => {

  const slugSong: string = req.params.slugSong;

  const song = await Song.findOne({
    slug: slugSong,
    status: "active",
    deleted: false
  })

  const singer = await Singer.findOne({
    _id: song.singerId,
    deleted: false
  }).select("fullName");

  const topic = await Topic.findOne({
    _id: song.topicId,
    deleted: false
  }).select("title");

  const favoriteSong = await FavoriteSong.findOne({
    songId: song.id
  });

  song["favoriteSong"] = favoriteSong ? true : false;


  res.render("client/pages/songs/detail", {
    pageTitle: "Chi tiết bài hát",
    song: song,
    singer: singer,
    topic: topic
  });
};

//[PATCH] /like/:typeLike/:idSong
export const like = async (req: Request, res: Response) => {

  const idSong: string = req.params.idSong;
  const typeLike: string = req.params.typeLike;

  const song = await Song.findOne({
    _id: idSong,
    deleted: false,
    status: "active"
  });
  const newLike: number = typeLike == "like" ? song.like + 1 : song.like - 1;
  await Song.updateOne({
    _id: idSong
  }, {
    like: newLike
  })
  res.json({
    code: 200,
    message: "Thành công",
    like: newLike
  })

};
//[PATCH] /favorite/:typeFavorite/:idSong
export const favorite = async (req: Request, res: Response) => {

  const idSong: string = req.params.idSong;
  const typeFavorite: string = req.params.typeFavorite;

  switch (typeFavorite) {
    case "favorite":
      const existFavorite = await FavoriteSong.findOne({
        songId: idSong
      });
      if (!existFavorite) {
        const record = new FavoriteSong({
          // userId:"",
          songId: idSong
        });
        await record.save();
      }
      break;
    case "unfavorite":
      await FavoriteSong.deleteOne({
        songId: idSong
      });
      break;

    default:
      break;
  }

  res.json({
    code: 200,
    message: "Thành công",
  })

};

//[PATCH] /listen/:idSong
export const listen = async (req: Request, res: Response) => {

  const idSong: string = req.params.idSong;
  // Giả định Song Model đã được import

  // 1. Tìm bài hát hiện tại
  const song = await Song.findOne({
    _id: idSong
  });

  // 2. Tính lượt nghe mới
  const listen: number = song.listen + 1;

  // 3. Cập nhật lượt nghe trong database
  await Song.updateOne({
    _id: idSong
  }, {
    listen: listen
  });

  // 4. Lấy lại dữ liệu mới sau khi cập nhật
  const songNew = await Song.findOne({
    _id: idSong
  });

  // 5. Trả về JSON response
  res.json({
    code: 200,
    message: "Thành công!",
    listen: songNew.listen
  });
};