import dotenv from "dotenv";
import path from "path";

const root = path.join(__dirname, ".env");
dotenv.config({ path: root });

const server = {
  listen: process.env.APP_LISTEN,
  port: process.env.APP_PORT,
  secret: process.env.SECRET,
  mongoose: process.env.MONGOOSE_URL,
  frontend: process.env.frontEndUrl
};

export default server;
