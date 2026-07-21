import { NextFunction } from "express";
import mongoose from "mongoose";

import slugify from 'slugify';


const topicSchema = new mongoose.Schema(
  {
    title: String,
    avatar: String,
    description: String,
    status: String,
    slug: {
      type: String,
      unique: true,
    },
    deleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: Date,
  },
  {
    timestamps: true,
  },
);
topicSchema.pre("save" as any, function (next: NextFunction) {
  if (this.isModified("title")) {
    this.slug = slugify(this.title as any, { lower: true, locale: 'vi', strict: true });
  }
  next();
});
const Topic = mongoose.model("Topic", topicSchema, "topics");
export default Topic;
