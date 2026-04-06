
import express, { Express } from "express";
import * as database from "./config/database";
import dotenv from "dotenv";
import { systemConfig } from "./config/config";
import path from "path";
import bodyParser from "body-parser";
import methodOverride from "method-override";
import cookieParser from "cookie-parser"
import flash from "express-flash";
import session from 'express-session';

import clientRoutes from "./router/client/index.router";
import adminRoutes from "./router/admin/index.router";


dotenv.config();
database.connect();
const app: Express = express();
const port: number | string = process.env.PORT || 3000;

//tiniMCE
app.use('/tinymce', express.static(path.join(__dirname, 'node_modules', 'tinymce')));

//pug
app.set("views", "./views");
app.set("view engine", "pug");

//method-override
app.use(methodOverride('_method'))

//body-parser
app.use(bodyParser.urlencoded())
app.use(bodyParser.json())

//cookie-parser
app.use(cookieParser())

//express-flash
app.use(cookieParser('QWERTYUIOPASDFGHJ'));
app.use(session({
  secret: 'Le_MINH_HIEU',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 60000 }
}));
app.use(flash());

app.use(express.static(`public`));


//app local variables
app.locals.prefixAdmin = systemConfig.prefixAdmin;

//adminRouter
adminRoutes(app);

//clientRouter
clientRoutes(app);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});