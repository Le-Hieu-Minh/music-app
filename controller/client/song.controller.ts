import { Request, Response } from "express";
import Topic from "../../models/topic.model";
import Song from "../../models/song.model";
import Singer from "../../models/singer.model";
import FavoriteSong from "../../models/favorite-song.model";
import Playlist from "../../models/playlist.model";
import { getPagination } from "../../helper/pagination";

//[GET] /songs/:slugTopic
export const list = async (req: Request, res: Response) => {
  const topic = await Topic.findOne({
    slug: req.params.slugTopic,
    status: "active",
    deleted: false
  });
  if (!topic) return res.redirect("/");

  const filter = {
    topicId: topic.id,
    status: "active",
    deleted: false
  };

  const total = await Song.countDocuments(filter);
  const pagination = getPagination(
    { page: req.query.page as string },
    total,
    12
  );

  const songs = await Song.find(filter)
    .select("avatar title slug like singerId listen createdAt")
    .skip(pagination.skip)
    .limit(pagination.limit);

  const finalSongs = [];

  for (const song of songs) {
    const infoSinger = await Singer.findOne({
      _id: song.singerId,
      status: "active",
      deleted: false
    }).lean();

    if (infoSinger) {
      (song as any)["infoSinger"] = infoSinger;
      finalSongs.push(song);
    }
  }

  res.render("client/pages/songs/list", {
    pageTitle: topic.title,
    songs: finalSongs,
    pagination,
    baseUrl: `/songs/${topic.slug}`
  });
};

//[GET] /songs/detail/:slugSong
export const detail = async (req: Request, res: Response) => {
  const slugSong: string = req.params.slugSong;
  const customer = res.locals.custummer;

  const song = await Song.findOne({
    slug: slugSong,
    status: "active",
    deleted: false
  });

  if (!song) return res.redirect("/");

  const singer = await Singer.findOne({
    _id: song.singerId,
    deleted: false
  }).select("fullName slug");

  const topic = await Topic.findOne({
    _id: song.topicId,
    deleted: false
  }).select("title slug");

  let isFavorite = false;
  let isLiked = false;
  let playlists: any[] = [];

  if (customer) {
    const favoriteSong = await FavoriteSong.findOne({
      songId: song.id,
      userId: customer.id,
      deleted: false
    });
    isFavorite = !!favoriteSong;
    isLiked = Array.isArray(song.like) && song.like.includes(customer.id);

    playlists = await Playlist.find({
      userId: customer.id,
      deleted: false
    })
      .select("title _id")
      .sort({ updatedAt: -1 })
      .lean();
  }

  // Queue: các bài cùng chủ đề (hoặc cùng ca sĩ nếu không có topic)
  const relatedFilter: any = {
    _id: { $ne: song._id },
    deleted: false,
    status: "active"
  };
  if (song.topicId) {
    relatedFilter.topicId = song.topicId;
  } else {
    relatedFilter.singerId = song.singerId;
  }

  const relatedSongs = await Song.find(relatedFilter)
    .select("title slug avatar audio lyrics singerId")
    .limit(20)
    .lean();

  const queue = [];
  for (const item of relatedSongs) {
    const infoSinger = await Singer.findOne({
      _id: item.singerId,
      deleted: false
    })
      .select("fullName")
      .lean();

    queue.push({
      _id: item._id,
      title: item.title,
      slug: item.slug,
      avatar: item.avatar,
      audio: item.audio,
      lyrics: item.lyrics,
      singerName: infoSinger ? infoSinger.fullName : "Unknown"
    });
  }

  const prevSong = queue.length > 0 ? queue[queue.length - 1] : null;
  const nextSong = queue.length > 0 ? queue[0] : null;

  (song as any)["isLiked"] = isLiked;
  (song as any)["favoriteSong"] = isFavorite;
  (song as any)["createdAtText"] = song.createdAt
    ? new Date(song.createdAt as Date).toLocaleDateString("vi-VN")
    : "";

  res.render("client/pages/songs/detail", {
    pageTitle: song.title || "Chi tiết bài hát",
    song,
    singer,
    topic,
    queue,
    prevSong,
    nextSong,
    playlists
  });
};

//[PATCH] /songs/like/:typeLike/:idSong
export const like = async (req: Request, res: Response) => {
  const idSong: string = req.params.idSong;
  const typeLike: string = req.params.typeLike;
  const user = res.locals.user;

  if (!user) {
    return res.status(401).json({ code: 401, message: "Vui lòng đăng nhập" });
  }

  const userId: string = user.id;
  const song = await Song.findOne({
    _id: idSong,
    deleted: false,
    status: "active"
  }).lean();

  if (!song) {
    return res.json({ code: 404, message: "Không tìm thấy bài hát" });
  }

  let currentLikes: string[] = (song.like as string[]) || [];

  if (typeLike === "like") {
    if (!currentLikes.includes(userId)) {
      currentLikes.push(userId);
    }
  } else if (typeLike === "dislike") {
    currentLikes = currentLikes.filter((item) => item !== userId);
  } else {
    return res.json({ code: 400, message: "Loại thao tác không hợp lệ" });
  }

  await Song.updateOne({ _id: idSong }, { like: currentLikes });

  res.json({
    code: 200,
    message: "Thành công",
    like: currentLikes.length
  });
};

//[PATCH] /songs/favorite/:typeFavorite/:idSong
export const favorite = async (req: Request, res: Response) => {
  const idSong: string = req.params.idSong;
  const typeFavorite: string = req.params.typeFavorite;
  const user = res.locals.user;

  if (!user) {
    return res.status(401).json({ code: 401, message: "Vui lòng đăng nhập" });
  }

  const userId: string = user.id;

  switch (typeFavorite) {
    case "favorite": {
      const existFavorite = await FavoriteSong.findOne({
        userId: userId,
        songId: idSong
      });
      if (!existFavorite) {
        const record = new FavoriteSong({
          userId: userId,
          songId: idSong
        });
        await record.save();
      } else if (existFavorite.deleted) {
        await FavoriteSong.updateOne(
          { _id: existFavorite.id },
          { deleted: false, deletedAt: null }
        );
      }
      break;
    }
    case "unfavorite":
      await FavoriteSong.updateOne(
        { userId: userId, songId: idSong },
        { deleted: true, deletedAt: new Date() }
      );
      break;
    default:
      return res.json({ code: 400, message: "Loại thao tác không hợp lệ" });
  }

  res.json({
    code: 200,
    message: "Thành công"
  });
};

//[PATCH] /songs/listen/:idSong
export const listen = async (req: Request, res: Response) => {
  const idSong: string = req.params.idSong;

  const song = await Song.findOne({
    _id: idSong,
    deleted: false,
    status: "active"
  });

  if (song) {
    const newListen = (song.listen || 0) + 1;
    await Song.updateOne({ _id: idSong }, { listen: newListen });
    res.json({ code: 200, message: "Thành công!", listen: newListen });
  } else {
    res.json({ code: 404, message: "Không tìm thấy bài hát" });
  }
};
