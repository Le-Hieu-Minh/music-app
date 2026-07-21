import { Request, Response } from "express";
import Playlist from "../../models/playlist.model";
import Song from "../../models/song.model";
import Singer from "../../models/singer.model";

const enrichSongs = async (songIds: string[]) => {
  const result = [];
  for (const songId of songIds) {
    const song = await Song.findOne({
      _id: songId,
      deleted: false,
      status: "active"
    }).lean();
    if (!song) continue;

    const infoSinger = await Singer.findOne({
      _id: song.singerId,
      deleted: false
    }).lean();

    result.push({
      ...song,
      infoSinger
    });
  }
  return result;
};

//[GET] /playlists
export const index = async (req: Request, res: Response) => {
  const user = res.locals.user;
  const playlists = await Playlist.find({
    userId: user.id,
    deleted: false
  }).sort({ updatedAt: -1 });

  res.render("client/pages/playlists/index", {
    pageTitle: "Playlist của tôi",
    playlists
  });
};

//[GET] /playlists/create
export const create = async (req: Request, res: Response) => {
  res.render("client/pages/playlists/create", {
    pageTitle: "Tạo playlist"
  });
};

//[POST] /playlists/create
export const createPost = async (req: Request, res: Response) => {
  const user = res.locals.user;
  const title = (req.body.title || "").trim();

  if (!title) {
    req.flash("error", "Tên playlist không được để trống");
    return res.redirect(req.get("Referer") || "/playlists/create");
  }

  const playlist = new Playlist({
    title,
    description: (req.body.description || "").trim(),
    userId: user.id,
    songs: []
  });
  await playlist.save();

  req.flash("success", "Tạo playlist thành công");
  res.redirect(`/playlists/${playlist.slug}`);
};

//[GET] /playlists/:slug
export const detail = async (req: Request, res: Response) => {
  const user = res.locals.user;
  const playlist = await Playlist.findOne({
    slug: req.params.slug,
    userId: user.id,
    deleted: false
  });

  if (!playlist) {
    return res.redirect("/playlists");
  }

  const songs = await enrichSongs(playlist.songs || []);

  res.render("client/pages/playlists/detail", {
    pageTitle: playlist.title,
    playlist,
    songs
  });
};

//[POST] /playlists/:id/songs
export const addSong = async (req: Request, res: Response) => {
  const user = res.locals.user;
  const songId = req.body.songId || req.params.songId;

  const playlist = await Playlist.findOne({
    _id: req.params.id,
    userId: user.id,
    deleted: false
  });

  if (!playlist) {
    return res.status(404).json({ code: 404, message: "Không tìm thấy playlist" });
  }

  const song = await Song.findOne({
    _id: songId,
    deleted: false,
    status: "active"
  });

  if (!song) {
    return res.status(404).json({ code: 404, message: "Không tìm thấy bài hát" });
  }

  if (!playlist.songs.includes(songId)) {
    playlist.songs.push(songId);
    await playlist.save();
  }

  if (req.headers.accept && req.headers.accept.includes("application/json")) {
    return res.json({ code: 200, message: "Đã thêm vào playlist" });
  }

  req.flash("success", "Đã thêm bài hát vào playlist");
  res.redirect(req.get("Referer") || `/playlists/${playlist.slug}`);
};

//[PATCH] /playlists/:id/songs/:songId
export const removeSong = async (req: Request, res: Response) => {
  const user = res.locals.user;

  const playlist = await Playlist.findOne({
    _id: req.params.id,
    userId: user.id,
    deleted: false
  });

  if (!playlist) {
    return res.status(404).json({ code: 404, message: "Không tìm thấy playlist" });
  }

  playlist.songs = (playlist.songs || []).filter((id) => id !== req.params.songId);
  await playlist.save();

  res.json({ code: 200, message: "Đã xóa bài hát khỏi playlist" });
};

//[PATCH] /playlists/delete/:id
export const deleteItem = async (req: Request, res: Response) => {
  const user = res.locals.user;

  await Playlist.updateOne(
    { _id: req.params.id, userId: user.id },
    { deleted: true, deletedAt: new Date() }
  );

  res.json({ code: 200, message: "Đã xóa playlist" });
};

//[GET] /playlists/api/mine — JSON list for add-to-playlist UI
export const mineApi = async (req: Request, res: Response) => {
  const user = res.locals.user;
  const playlists = await Playlist.find({
    userId: user.id,
    deleted: false
  })
    .select("title slug _id")
    .sort({ updatedAt: -1 })
    .lean();

  res.json({ code: 200, playlists });
};
