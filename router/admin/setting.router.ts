import { Router } from "express";
const router: Router = Router();
import * as controller from "../../controller/admin/setting.controller";
import multer from 'multer';
import * as uploadClound from "../../middlewares/admin/uploadClound.middleware";

const upload = multer();

router.get("/general", controller.general);
router.patch("/general", upload.fields(
  [
    { name: 'logo', maxCount: 1 }
  ]
), uploadClound.uploadFields, controller.generalPatch);

export const settingRoutes: Router = router;