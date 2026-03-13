
import express, { Express } from "express";
import * as database from "./config/database";
import dotenv from "dotenv";
import { systemConfig } from "./config/config";
import path from "path";
import bodyParser from "body-parser";
import methodOverride from "method-override";
import cookieParser from "cookie-parser"

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

app.use(methodOverride('_method'))

app.use(bodyParser.urlencoded())
app.use(bodyParser.json())

app.use(cookieParser())


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