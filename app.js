// external package
const express = require("express");
const path = require("path");
const http = require("http");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const moment = require("moment");

// internal imports
const loginRoute = require("./routers/login.route");
const userRoute = require("./routers/user.route");
const inboxRoute = require("./routers/inbox.route");
const {
  NotFoundHandler,
  errorHandler,
} = require("./middleware/common/errorHandler");

// app object
const app = express();
const server = http.createServer(app);
dotenv.config();

const io = require("socket.io")(server);
global.io = io;

// database connection
require("./db/connection");

app.locals.moment = moment;

// request parser

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// cookie parser
app.use(cookieParser(process.env.COOKIE_SECRET));

// set the view engine
app.set("view engine", "ejs");

// static file path
app.use(express.static(path.join(__dirname, "public")));

//all the route
app.use("/", loginRoute.router);
app.use("/users", userRoute.router);
app.use("/inbox", inboxRoute.router);

// eror handler
app.use(NotFoundHandler);
app.use(errorHandler);

server.listen(process.env.PORT, () => {
  console.log(`app is listening to port: ${process.env.PORT}`);
});
