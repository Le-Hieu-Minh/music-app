import { Express } from "express";
import { dashboardRoutes } from "./dashboard.router";
import { systemConfig } from "../../config/config";
import { topicRoutes } from "./topic.router";
import { songRoutes } from "./song.router";
import { singerRoutes } from "./singer.router";
import { myAccountRoutes } from "./my-account.router";
import { uploadRoutes } from "./upload.router";
import { authRoutes } from "./auth.router";
import { RoleRoutes } from "./role.router";
import { accountRoutes } from "./account.router";
import { settingRoutes } from "./setting.router";
import * as authMiddleware from "../../middlewares/admin/auth.middleware";


const adminRoutes = (app: Express): void => {
  const PATH_ADMIN = `/${systemConfig.prefixAdmin}`;
  app.use(`${PATH_ADMIN}/dashboard`, authMiddleware.requireAuth, dashboardRoutes);
  app.use(`${PATH_ADMIN}/topics`, authMiddleware.requireAuth, topicRoutes);
  app.use(`${PATH_ADMIN}/songs`, authMiddleware.requireAuth, songRoutes);
  app.use(`${PATH_ADMIN}/singers`, authMiddleware.requireAuth, singerRoutes);
  app.use(`${PATH_ADMIN}/my-account`, authMiddleware.requireAuth, myAccountRoutes);
  app.use(`${PATH_ADMIN}/roles`, authMiddleware.requireAuth, RoleRoutes);
  app.use(`${PATH_ADMIN}/accounts`, authMiddleware.requireAuth, accountRoutes);
  app.use(`${PATH_ADMIN}/settings`, authMiddleware.requireAuth, settingRoutes);

  app.use(`${PATH_ADMIN}/upload`, uploadRoutes);

  app.use(`${PATH_ADMIN}/auth`, authRoutes);
};

export default adminRoutes;
