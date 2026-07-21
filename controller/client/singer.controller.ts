import { Request, Response } from "express";
import Singer from "../../models/singer.model";
import Song from "../../models/song.model";

//[GET] /singers
export const index = async (req: Request, res: Response) => {
  const singers = await Singer.find({
    deleted: false,
    status: "active"
  }).sort({ fullName: 1 });

  res.render("client/pages/singers/index", {
    pageTitle: "Ca sĩ",
    singers: singers
  });
};

//[GET] /singers/:slug
export const detail = async (req: Request, res: Response) => {
  const singer = await Singer.findOne({
    slug: req.params.slug,
    deleted: false,
    status: "active"
  });

  if (!singer) {
    return res.redirect("/");
  }

  const songs = await Song.find({
    singerId: singer.id,
    deleted: false,
    status: "active"
  }).select("avatar title slug like listen createdAt");

  res.render("client/pages/singers/detail", {
    pageTitle: singer.fullName,
    singer: singer,
    songs: songs
  });
};
