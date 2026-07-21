import mongoose from "mongoose";
import slugify from "slugify";
import { NextFunction } from "express";

const playlistSchema = new mongoose.Schema(
  {
    title: String,
    userId: String,
    description: String,
    slug: {
      type: String,
      unique: true
    },
    songs: {
      type: [String],
      default: []
    },
    deleted: {
      type: Boolean,
      default: false
    },
    deletedAt: Date
  },
  {
    timestamps: true
  }
);

playlistSchema.pre("save" as any, function (next: NextFunction) {
  if (this.isModified("title") || !this.slug) {
    const base = slugify((this.title as string) || "playlist", {
      lower: true,
      locale: "vi",
      strict: true
    });
    this.slug = `${base}-${Date.now().toString(36)}`;
  }
  next();
});

const Playlist = mongoose.model("Playlist", playlistSchema, "playlists");
export default Playlist;
