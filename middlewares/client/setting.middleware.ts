import { NextFunction, Request, Response } from "express";
import SettingGeneral from "../../models/setting.model";

export const generalSetting = async (req: Request, res: Response, next: NextFunction) => {
  const settingGeneral = await SettingGeneral.findOne({});
  res.locals.settingGeneral = settingGeneral || {
    websiteName: "Music App",
    logo: "/image/spotify_logo.jpg"
  };
  next();
};
