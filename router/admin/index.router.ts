import { Express } from "express";
import { dashboardRoutes } from "./dashboard.router";
import { systemConfig } from "../../config/config";
import { topicRoutes } from "./topic.router";
import { songRoutes } from "./song.router";
import { uploadRoutes } from "./upload.router";

const adminRoutes = (app: Express): void => {
  const PATH_ADMIN = `/${systemConfig.prefixAdmin}`;
  app.use(`${PATH_ADMIN}/dashboard`, dashboardRoutes);
  app.use(`${PATH_ADMIN}/topics`, topicRoutes);
  app.use(`${PATH_ADMIN}/songs`, songRoutes);

  app.use(`${PATH_ADMIN}/upload`, uploadRoutes);

};

export default adminRoutes;