import { Router } from "express";
const router: Router = Router();
import * as controller from "../../controller/client/user.controller";
import * as authMiddleware from "../../middlewares/client/auth.middleware";

router.get("/register", controller.register);
router.post("/register", controller.registerPost);

router.get("/login", controller.login);
router.post("/login", controller.loginPost);

router.get("/refresh-token", controller.refreshToken);

router.get("/logout", controller.logout);

router.get("/info", authMiddleware.requireAuth, controller.info);
router.get("/edit", authMiddleware.requireAuth, controller.edit);
router.post("/edit", authMiddleware.requireAuth, controller.editPost);

router.get("/fogot-password", controller.forgotPassword);
router.post("/fogot-password", controller.forgotPasswordPost);

router.get("/fogot-password/otp", controller.otp);
router.post("/fogot-password/otp", controller.otpPost);

router.get("/fogot-password/reset-password", controller.reset);
router.post("/fogot-password/reset-password", controller.resetPost);

export const userRoutes: Router = router;
