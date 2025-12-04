import { Express } from "express";
import { topicRoutes } from "./topic.router";
import { songRoutes } from "./song.router";

const clientRoutes = (app: Express): void => {
  app.use(`/topics`, topicRoutes);
  app.use(`/songs`, songRoutes);
};

export default clientRoutes;