import { NextFunction } from "express";
import mongoose from "mongoose";

import slugify from 'slugify';



const songSchema = new mongoose.Schema(
  {
    title: String,
    avatar: String,
    description: String,
    singerId: String,
    topicId: String,
    like: {
      type: Array,
      default: [],
    },
    listen: {
      type: Number,
      default: 0
    },
    lyrics: String,
    audio: String,
    status: String,
    slug: {
      type: String,
      unique: true
    },
    deleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: Date,
  },
  {
    timestamps: true,
  }
);

songSchema.pre("save" as any, function (next: NextFunction) {
  if (this.isModified("title")) {
    this.slug = slugify(this.title as any, { lower: true, locale: 'vi', strict: true });
  }
  next();
});

const Song = mongoose.model("Song", songSchema, "songs");
export default Song;