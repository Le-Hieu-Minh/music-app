import { Router } from "express";
import multer from "multer";
const router: Router = Router();
import * as controller from "../../controller/admin/song.controller";
import * as uploadClound from "../../middlewares/admin/uploadClound.middleware";
import * as permissionMiddleware from "../../middlewares/admin/permission.middleware";

const upload = multer();

router.get("/", permissionMiddleware.requirePermission("music_view"), controller.index);
router.get("/create", permissionMiddleware.requirePermission("music_create"), controller.create);
router.post(
  "/create",
  permissionMiddleware.requirePermission("music_create"),
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "audio", maxCount: 1 }
  ]),
  uploadClound.uploadFields,
  controller.createPost
);

router.get("/edit/:id", permissionMiddleware.requirePermission("music_edit"), controller.edit);
router.patch(
  "/edit/:id",
  permissionMiddleware.requirePermission("music_edit"),
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "audio", maxCount: 1 }
  ]),
  uploadClound.uploadFields,
  controller.editPatch
);

router.patch("/delete/:id", permissionMiddleware.requirePermission("music_delete"), controller.deleteItem);
router.get("/detail/:id", permissionMiddleware.requirePermission("music_view"), controller.detail);
router.patch(
  "/changeStatus/:status/:id",
  permissionMiddleware.requirePermission("music_edit"),
  controller.changeStatus
);

export const songRoutes: Router = router;
