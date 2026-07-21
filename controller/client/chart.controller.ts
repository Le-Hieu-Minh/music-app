import { Request, Response } from "express";
import Song from "../../models/song.model";
import Singer from "../../models/singer.model";
import { getPagination } from "../../helper/pagination";

//[GET] /charts
export const index = async (req: Request, res: Response) => {
  const type = (req.query.type as string) === "like" ? "like" : "listen";

  const filter = {
    deleted: false,
    status: "active"
  };

  const total = await Song.countDocuments(filter);
  const pagination = getPagination(
    { page: req.query.page as string },
    total,
    20
  );

  let songs: any[] = [];

  if (type === "like") {
    songs = await Song.aggregate([
      { $match: filter },
      {
        $addFields: {
          likeCount: { $size: { $ifNull: ["$like", []] } }
        }
      },
      { $sort: { likeCount: -1, createdAt: -1 } },
      { $skip: pagination.skip },
      { $limit: pagination.limit }
    ]);
  } else {
    songs = await Song.find(filter)
      .sort({ listen: -1, createdAt: -1 })
      .skip(pagination.skip)
      .limit(pagination.limit)
      .lean();
  }

  for (const song of songs) {
    const infoSinger = await Singer.findOne({
      _id: song.singerId,
      deleted: false
    }).lean();
    song.infoSinger = infoSinger;
    song.likeCount = Array.isArray(song.like)
      ? song.like.length
      : song.likeCount || 0;
    if (song._id && !song.id) {
      song.id = String(song._id);
    }
  }

  res.render("client/pages/charts/index", {
    pageTitle: type === "like" ? "BXH yêu thích" : "BXH lượt nghe",
    songs,
    type,
    pagination
  });
};
