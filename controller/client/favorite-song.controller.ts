import { Request, Response } from "express";
import FavoriteSong from "../../models/favorite-song.model";
import Song from "../../models/song.model";
import Singer from "../../models/singer.model";


//[GET] /favorite-songs
export const index = async (req: Request, res: Response) => {
  const favoriteSongs = await FavoriteSong.find({
    // userId:"",
    deleted: false,

  })

  const finalFavoriteSongs = [];

  for (const item of favoriteSongs) {
    const infoSong = await Song.findOne({
      _id: item.songId,
      deleted: false // Khi Admin xóa, điều kiện này sẽ khiến infoSong = null
    });


    if (infoSong) {
      const infoSinger = await Singer.findOne({
        _id: infoSong.singerId,
        deleted: false
      });


      item["infoSong"] = infoSong;
      item["infoSinger"] = infoSinger;


      finalFavoriteSongs.push(item);
    }

  }

  res.render("client/pages/favorite-songs/index", {
    pageTitle: "Bài hát yêu thích",
    favoriteSongs: finalFavoriteSongs
  });
};