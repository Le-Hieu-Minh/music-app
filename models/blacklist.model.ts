import mongoose from "mongoose";


const blacklistSchema = new mongoose.Schema(
  {
    token: String,
    expireAt: { type: Date, expires: 0 }
  }

);

const Blacklist = mongoose.model("Blacklist", blacklistSchema, "blacklists");
export default Blacklist;
