import { Router } from "express";
import multer from "multer";
const router: Router = Router();

import * as controller from "../../controller/admin/my-account.controller";
import * as uploadClound from "../../middlewares/admin/uploadClound.middleware";

const upload = multer();

router.get("/", controller.index);

router.get("/edit", controller.edit);

router.patch(
  "/edit",
  upload.single("avatar"),
  uploadClound.uploadSingle,

  controller.editPatch,
);

export const myAccountRoutes: Router = router;
