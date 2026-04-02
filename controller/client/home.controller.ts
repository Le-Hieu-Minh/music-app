import { Request, Response } from "express";
import Singer from "../../models/singer.model";
import Song from "../../models/song.model";
import Topic from "../../models/topic.model";


export const index = async (req: Request, res: Response) => {
  const topics = await Topic.find({ deleted: false, status: "active" }).limit(6);
  const singers = await Singer.find({ deleted: false, status: "active" }).limit(6);
  const songs = await Song.find({ deleted: false, status: "active" }).limit(9);
  for (const song of songs) {
    const infoSinger = await Singer.findOne({ _id: song.singerId });
    song["infoSinger"] = infoSinger;
  }

  res.render("client/pages/home/index", {
    pageTitle: "Trang chủ Music App",
    topics: topics,
    singers: singers,
    songs: songs
  });
};