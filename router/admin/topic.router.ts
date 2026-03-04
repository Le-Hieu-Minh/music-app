import { Router } from "express";
import multer from "multer"
const router: Router = Router();

import * as controller from "../../controller/admin/topic.controller";
import * as uploadClound from "../../middlewares/admin/uploadClound.middleware"

const upload = multer();

router.get("/", controller.topics);

router.get("/create", controller.create);
router.post("/create", upload.fields(
  [
    { name: 'avatar', maxCount: 1 }
  ]
), uploadClound.uploadFields, controller.createPost);

router.get("/edit/:id", controller.edit);
router.patch("/edit/:id", upload.fields(
  [
    { name: 'avatar', maxCount: 1 },
    { name: 'audio', maxCount: 1 }
  ]
), uploadClound.uploadFields, controller.editPatch);

router.delete("/delete/:id", controller.deleteItem);

router.get("/detail/:id", controller.detail);

router.patch("/changeStatus/:status/:id", controller.changeStatus);


export const topicRoutes: Router = router;