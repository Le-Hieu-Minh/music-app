import { Request, Response } from "express";
import Singer from "../../models/singer.model";
import Song from "../../models/song.model";
import Topic from "../../models/topic.model";

export const index = async (req: Request, res: Response) => {
  const topics = await Topic.find({
    deleted: false,
    status: "active"
  }).limit(6);

  const singers = await Singer.find({
    deleted: false,
    status: "active"
  }).limit(6);

  const songs = await Song.find({
    deleted: false,
    status: "active"
  })
    .sort({ listen: -1, createdAt: -1 })
    .limit(9)
    .lean();

  for (const song of songs as any[]) {
    const infoSinger = await Singer.findOne({
      _id: song.singerId,
      deleted: false
    }).lean();
    song["infoSinger"] = infoSinger;
  }

  const newSongs = await Song.find({
    deleted: false,
    status: "active"
  })
    .sort({ createdAt: -1 })
    .limit(6)
    .lean();

  for (const song of newSongs as any[]) {
    const infoSinger = await Singer.findOne({
      _id: song.singerId,
      deleted: false
    }).lean();
    song["infoSinger"] = infoSinger;
  }

  res.render("client/pages/home/index", {
    pageTitle: "Trang chủ Music App",
    topics: topics,
    singers: singers,
    songs: songs,
    newSongs: newSongs
  });
};
