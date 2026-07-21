import { Request, Response } from "express";
import FavoriteSong from "../../models/favorite-song.model";
import Song from "../../models/song.model";
import Singer from "../../models/singer.model";

export const index = async (req: Request, res: Response) => {
  const user = res.locals.user;

  if (!user) {
    return res.redirect("/users/login");
  }

  const favoriteSongs = await FavoriteSong.find({
    userId: user.id,
    deleted: false
  }).lean();

  const finalFavoriteSongs = [];

  for (const item of favoriteSongs) {
    const infoSong = await Song.findOne({
      _id: item.songId,
      deleted: false,
      status: "active"
    }).lean();

    if (infoSong) {
      const infoSinger = await Singer.findOne({
        _id: infoSong.singerId,
        deleted: false
      }).lean();

      finalFavoriteSongs.push({
        ...item,
        infoSong: infoSong,
        infoSinger: infoSinger
      });
    }
  }

  res.render("client/pages/favorite-songs/index", {
    pageTitle: "Bài hát yêu thích",
    favoriteSongs: finalFavoriteSongs
  });
};
