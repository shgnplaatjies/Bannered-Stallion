import { ConfidentialClientApplication } from "@azure/msal-node";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import errorHandler from "errorhandler";
import express from "express";
import session from "express-session";
import morgan from "morgan";
import path from "path";
import { createRoutes } from "./routes/route";
import { msalConfig } from "./services/config/auth.config";
import { handleError } from "./services/utils/error.service";

export async function createApp() {
  const app = express();

  if (process.env.NODE_ENV === "dev") app.use(morgan("tiny"));

  app.use(
    session({
      secret: process.env.EXPRESS_SESSION_SECRET ?? "",
      resave: true,
      cookie: {
        maxAge: process.env.NODE_ENV === "dev" ? 1000 * 180 : 3600000, // 3 minute sessions
        secure: process.env.NODE_ENV !== "dev",
      },
      saveUninitialized: false,
    })
  );

  app.use(cookieParser());

  app.use(bodyParser.json());

  app.use(express.urlencoded({ extended: false }));

  app.use(express.static(path.join(__dirname, "./static")));

  try {
    const confidentialClient: ConfidentialClientApplication =
      new ConfidentialClientApplication(msalConfig());

    const routes = await createRoutes(confidentialClient);

    app.use("/", routes);

    if (process.env.NODE_ENV === "dev") app.use(errorHandler());

    return app;
  } catch (error) {
    if (process.env.NODE_ENV !== "dev") return process.exit();
    handleError(new Error(`${error}\nAborting...`));
    throw error;
  }
}
