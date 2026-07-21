import { NextFunction } from "express";
import mongoose from "mongoose";
import slugify from "slugify";



const singerSchema = new mongoose.Schema(
  {
    fullName: String,
    avatar: String,
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


singerSchema.pre("save" as any, function (next: NextFunction) {
  if (this.isModified("fullName")) {
    this.slug = slugify(this.fullName as any, { lower: true, locale: 'vi', strict: true });
  }
  next();
});

const Singer = mongoose.model("Singer", singerSchema, "singers");
export default Singer;