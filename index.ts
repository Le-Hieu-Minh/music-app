import express, { Express } from "express";
import * as database from "./config/database";
import dotenv from "dotenv";
import { systemConfig } from "./config/config";
import path from "path";
import bodyParser from "body-parser";
import methodOverride from "method-override";
import cookieParser from "cookie-parser";
import flash from "express-flash";
import session from "express-session";

import clientRoutes from "./router/client/index.router";
import adminRoutes from "./router/admin/index.router";

dotenv.config();
database.connect();
const app: Express = express();
const port: number | string = process.env.PORT || 3000;

// TinyMCE
app.use("/tinymce", express.static(path.join(__dirname, "node_modules", "tinymce")));

// Pug
app.set("views", "./views");
app.set("view engine", "pug");

// Method override
app.use(methodOverride("_method"));

// Body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Cookie + session + flash
app.use(cookieParser(process.env.COOKIE_SECRET || "QWERTYUIOPASDFGHJ"));
app.use(session({
  secret: process.env.SESSION_SECRET || "Le_MINH_HIEU",
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 60000 }
}));
app.use(flash());

app.use(express.static("public"));

app.locals.prefixAdmin = systemConfig.prefixAdmin;

adminRoutes(app);
clientRoutes(app);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
