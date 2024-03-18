import {
  ConfidentialClientApplication,
  InteractionRequiredAuthError,
} from "@azure/msal-node";
import { NextFunction, Request, Response } from "express";
import { buildAuthCookieFromToken } from "../controllers/auth.controller";
import { CustomSessionData } from "../services/types/interface";
import { handleError } from "../services/utils/error.service";

export const createAuthMiddleware = (
  confidentialClientAuth: ConfidentialClientApplication
) => {
  return {
    guard: async (
      req: Request & { session: CustomSessionData },
      res: Response,
      next: NextFunction
    ) => {
      const authHeader = req.headers.authorization;
      const hasBearerToken = authHeader && authHeader.startsWith("Bearer ");

      if (hasBearerToken) {
        const token = authHeader.split(" ")[1];

        const tokenResponse =
          await confidentialClientAuth.acquireTokenOnBehalfOf({
            scopes: ["user.read"],
            oboAssertion: token,
          });

        if (!tokenResponse) {
          handleError(
            new Error("Error in bearer token authentication."),
            "Redirecting to login page."
          );
          return res.redirect("/auth/login");
        }
        const authCookie = buildAuthCookieFromToken(tokenResponse);

        if (!authCookie) {
          handleError(
            new Error("Building auth cookie failed."),
            "Redirecting to interactive login."
          );
          return res.redirect("auth/login");
        }

        req.session.authCookie = authCookie;

        return next();
      }

      if (req.session.authCookie?.idToken) {
        const accountInfo = req.session.authCookie?.account;

        if (!accountInfo) {
          handleError(
            new Error("Invalid Auth Cookie"),
            "Redirecting to login page"
          );
          return res.redirect("/auth/login");
        }

        try {
          const tokenResponse = await confidentialClientAuth.acquireTokenSilent(
            {
              scopes: ["user.read"],
              account: accountInfo,
            }
          );

          const authCookie = buildAuthCookieFromToken(tokenResponse);

          if (!authCookie) {
            handleError(
              new Error("Building auth cookie failed."),
              "Redirecting to interactive login."
            );
            return res.redirect("auth/login");
          }

          const updatedCookie = {
            ...req.session.authCookie,
            ...authCookie,
          };

          req.session.authCookie = updatedCookie;

          return next();
        } catch (error) {
          if (error instanceof InteractionRequiredAuthError) {
            handleError(
              new Error(String(error)),
              `Unexpected exception occurred in auth middleware.
                Redirecting to interactive login.`
            );
            return res.status(401).redirect("/auth/login");
          }

          handleError(
            new Error(String(error)),
            "Failed silent token acquisition.",
            { req, res, status: 500 }
          );
        }
      }

      return handleError(
        new Error("Auth Cookie not found."),
        "Please login or register.",
        { res, req, status: 401 }
      );
    },
  };
};
