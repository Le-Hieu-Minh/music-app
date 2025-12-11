import { Request, Response } from "express";
import FavoriteSong from "../../models/favorite-song.model";
import Song from "../../models/song.model";
import Singer from "../../models/singer.model";
import { convertToSlug } from "../../helper/convertToSlug";


//[GET] /search/:type
export const result = async (req: Request, res: Response) => {
  const type = req.params.type;
  const keyword: string = `${req.query.keyword}`;

  let newSong = [];
  if (keyword) {
    const keywordRegex = new RegExp(keyword, "i");
    //tao slug
    const stringSlug = convertToSlug(keyword);
    const stringSlugRegex = new RegExp(stringSlug, "i");
    const songs = await Song.find({
      $or: [
        { title: keywordRegex },
        { slug: stringSlugRegex }
      ]
    });

    for (const item of songs) {
      const infoSinger = await Singer.findOne({
        _id: item.singerId,
        deleted: false
      });

      newSong.push({
        id: item.id,
        title: item.title,
        avatar: item.avatar,
        slug: item.slug,
        like: item.like,
        infoSinger: { fullName: infoSinger.fullName }
      });
    }
  }

  switch (type) {
    case "result":
      res.render("client/pages/search/result", {
        pageTitle: `Kết quả:${keyword} `,
        keyword: keyword,
        songs: newSong
      })
      break;
    case "suggest":
      res.json({
        code: 200,
        message: "Thành công",
        songs: newSong
      })
      break;

    default:
      res.json({
        code: 400,
        message: "Thất bại",

      })
      break;
  }

};

