import { Express } from "express";
import { topicRoutes } from "./topic.router";
import { songRoutes } from "./song.router";
import { favoriteSongRoutes } from "./favorite-song.router";
import { searchRoutes } from "./search.router";
import { userRoutes } from "./user.router";
import * as  settingMiddleware from "../../middlewares/client/setting.middleware";

const clientRoutes = (app: Express): void => {
  app.use(settingMiddleware.generalSetting);

  app.use(`/topics`, topicRoutes);
  app.use(`/songs`, songRoutes);
  app.use(`/favorite-songs`, favoriteSongRoutes);
  app.use(`/search`, searchRoutes);
  app.use(`/users`, userRoutes);
};

export default clientRoutes;