import { Request, Response } from "express";


//[GET] /topics
export const dashboard = async (req: Request, res: Response) => {


  res.render("admin/pages/dashboard/index", {
    pageTitle: "Trang dashboard",

  });
}