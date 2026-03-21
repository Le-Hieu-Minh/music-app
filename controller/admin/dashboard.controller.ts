import { Request, Response } from "express";
import Singer from "../../models/singer.model";
import Topic from "../../models/topic.model";
import Song from "../../models/song.model";


//[GET] /topics
export const dashboard = async (req: Request, res: Response) => {

  const singer = await Singer.countDocuments({ deleted: false });
  const topic = await Topic.countDocuments({ deleted: false });
  const song = await Song.countDocuments({ deleted: false });


  res.render("admin/pages/dashboard/index", {
    pageTitle: "Trang dashboard",
    singer: singer,
    topic: topic,
    song: song
  });
}