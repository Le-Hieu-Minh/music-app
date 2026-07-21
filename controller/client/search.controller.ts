import { Request, Response } from "express";
import Song from "../../models/song.model";
import Singer from "../../models/singer.model";
import { convertToSlug } from "../../helper/convertToSlug";

// 1. Định nghĩa Interface cho object bài hát mới
interface SongResult {
  id: string;
  title: string;
  avatar?: string;
  slug: string;
  like?: number;
  infoSinger: {
    fullName: string;
  };
}

export const result = async (req: Request, res: Response) => {
  const type = req.params.type;
  const keyword: string = `${req.query.keyword}`;

  // 2. Khai báo mảng với kiểu dữ liệu rõ ràng
  let newSongs: SongResult[] = [];

  if (keyword) {
    const keywordRegex = new RegExp(keyword, "i");
    const stringSlug = convertToSlug(keyword);
    const stringSlugRegex = new RegExp(stringSlug, "i");

    const songDocs = await Song.find({
      $or: [
        { title: keywordRegex },
        { slug: stringSlugRegex }
      ],
      deleted: false,
      status: "active"
    }).limit(30);

    const songs = [...songDocs];

    const singers = await Singer.find({
      fullName: keywordRegex,
      deleted: false,
      status: "active"
    }).select("_id");
    const singerIds = singers.map((s) => s.id);
    if (singerIds.length) {
      const songsBySinger = await Song.find({
        singerId: { $in: singerIds },
        deleted: false,
        status: "active"
      }).limit(20);
      for (const s of songsBySinger) {
        if (!songs.find((x) => String(x.id) === String(s.id))) {
          songs.push(s);
        }
      }
    }

    for (const item of songs) {
      const infoSinger = await Singer.findOne({
        _id: item.singerId,
        deleted: false
      }).lean();

      // 3. Kiểm tra infoSinger tồn tại trước khi truy cập fullName
      if (infoSinger) {
        newSongs.push({
          id: item.id,
          title: item.title as string,
          avatar: item.avatar as string,
          slug: item.slug as string,
          like: (item.like as string[]).length,
          infoSinger: {
            fullName: infoSinger.fullName as string
          }
        });
      }
    }
  }

  switch (type) {
    case "result":
      res.render("client/pages/search/result", {
        pageTitle: `Kết quả: ${keyword}`,
        keyword: keyword,
        songs: newSongs
      });
      break;
    case "suggest":
      res.json({
        code: 200,
        message: "Thành công",
        songs: newSongs
      });
      break;
    default:
      res.json({
        code: 400,
        message: "Thất bại",
      });
      break;
  }
};