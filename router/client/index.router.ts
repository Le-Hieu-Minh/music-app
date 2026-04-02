import { Express } from "express";
import { topicRoutes } from "./topic.router";
import { songRoutes } from "./song.router";
import { favoriteSongRoutes } from "./favorite-song.router";
import { searchRoutes } from "./search.router";
import { userRoutes } from "./user.router";
import { homeRoutes } from './home.router';
import * as  settingMiddleware from "../../middlewares/client/setting.middleware";
import * as authMiddleware from "../../middlewares/client/auth.middleware";
import * as userInfoMiddleware from "../../middlewares/client/user.middleware";

const clientRoutes = (app: Express): void => {
  app.use(settingMiddleware.generalSetting);
  app.use(userInfoMiddleware.userInfo);

  app.use(`/topics`, topicRoutes);
  app.use(`/songs`, songRoutes);
  app.use(`/favorite-songs`, authMiddleware.requireAuth, favoriteSongRoutes);
  app.use(`/search`, searchRoutes);
  app.use(`/users`, userRoutes);
  app.use(`/`, homeRoutes);
};

export default clientRoutes;