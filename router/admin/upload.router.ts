import { Router } from "express";
import multer from "multer";
const router: Router = Router();
import * as controller from "../../controller/admin/upload.controller";
import * as uploadClound from "../../middlewares/admin/uploadClound.middleware";


const upload = multer();

router.post("/", upload.single("file"), uploadClound.uploadSingle, controller.index);

export const uploadRoutes: Router = router;