import express from "express";
import session from "express-session";

import mongoose from "mongoose";
import connectMongo from "connect-mongo";

import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";

import { server, passport } from "./config";

import { api } from "./routes";

// Initialize Express
const app = express();
const MongoStore = connectMongo(session); // store session
// DB
mongoose.connection
  .on("error", error => console.log(error))
  .on("close", () => console.log("Database connection closed."))
  .once("open", () => {
    const info = mongoose.connections[0];
    console.log(`Connected to db ${info.host}:${info.port}/${info.name}`);
  });

mongoose.connect(server.mongoose, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true
});

// Set and use
app.use(bodyParser.json()); // define body parser for json
app.use(morgan("combined")); // define morgan logging request
app.use(helmet()); // define helmet headers
app.use(cookieParser()); // read cookies (needed for auth)
app.use(cors({ credentials: true, origin: server.frontend }));
// For passport
app.use(
  session({
    secret: server.secret,
    resave: true,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
    cookie: { httpOnly: false, maxAge: 64 * 60 * 1000 }
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Routing
app.use("/api", api);
// Catch 404 and forward to error handler
app.use((req, res, next) => {
  const error = [
    {
      status: 404,
      message: "Not found",
      additionalData: `URL = ${req.url}`
    }
  ];

  next(error);
});

// Error handler
app.use((error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }

  return res.status(error[0].status || 500).send(
    { errors: error } || {
      errors: [
        {
          status: error[0].status || 500,
          message: "Something went wrong",
          additionalData: ""
        }
      ]
    }
  );
});

// Start Server
app.listen(server.port, server.listen, () => {
  console.log(`Server started on ${server.listen}:${server.port}`);
});
