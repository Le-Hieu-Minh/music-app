import { Request, Response } from "express";
import { systemConfig } from "../../config/config";
import SettingGeneral from "../../models/setting.model";

interface SettingGeneralData {
  websiteName: string;
  logo?: string;
  email: string;
  phone: string;
  address: string;
  copyright: string;
}

//[GET] /admin/settings/general
export const general = async (req: Request, res: Response) => {
  const settingGeneral = await SettingGeneral.findOne({});
  res.render("admin/pages/settings/general", {
    pageTitle: "Trang cài đặt chung",
    settingGeneral: settingGeneral
  });
};

//[PATCH] admin/settings/general
export const generalPatch = async (req: Request, res: Response) => {
  try {
    const settingGeneral = await SettingGeneral.findOne({});

    const dataSetting: SettingGeneralData = {
      websiteName: req.body.websiteName,
      email: req.body.email,
      phone: req.body.phone,
      address: req.body.address,
      copyright: req.body.copyright
    };

    if (req.body.logo && req.body.logo[0]) {
      dataSetting.logo = req.body.logo[0];
    }

    if (!settingGeneral) {
      const record = new SettingGeneral(dataSetting);
      await record.save();
      req.flash("success", "Tạo cài đặt thành công");
    } else {
      await SettingGeneral.updateOne({ _id: settingGeneral.id }, dataSetting);
      req.flash("success", "Sửa thành công");
    }

    res.redirect(req.get("Referer") || `/${systemConfig.prefixAdmin}/settings/general`);
  } catch (error) {
    req.flash("error", "Sửa thất bại");
    res.redirect(req.get("Referer") || `/${systemConfig.prefixAdmin}/settings/general`);
  }
};
