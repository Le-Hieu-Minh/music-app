import { Router } from "express";
const router: Router = Router();
import * as controller from "../../controller/client/user.controller";


router.get("/register", controller.register);
router.post("/register", controller.registerPost);

router.get("/login", controller.login);
router.post("/login", controller.loginPost);

router.get("/refresh-token", controller.refreshToken);

router.get("/logout", controller.logout);


export const userRoutes: Router = router;