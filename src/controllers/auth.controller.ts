import {
  AuthenticationResult,
  ConfidentialClientApplication,
  InteractionRequiredAuthError,
} from "@azure/msal-node";
import { Request, Response } from "express";
import { STATUS_CODES } from "http";
import { EntityManager } from "typeorm";
import { Role } from "../models/Role.entity";
import { User } from "../models/User.entity";
import {
  getLoginRedirectUri,
  getRegisterRedirectUri,
} from "../services/config/auth.config";
import { CustomSessionData, MsalAuthCookie } from "../services/types/interface";
import { handleError } from "../services/utils/error.service";

export const buildAuthCookieFromToken = (
  tokenResponse: AuthenticationResult & {
    idTokenClaims?: {
      sub?: string;
      name?: string;
      preferred_username?: string;
    };
  }
): MsalAuthCookie | false => {
  const { accessToken, idToken, idTokenClaims, authority, expiresOn, account } =
    tokenResponse;
  const { sub, name, preferred_username } = idTokenClaims;

  if (!sub || !name || !preferred_username) {
    handleError(
      new Error(`Invalid authentication result, unable to build authCookie.
      Token Response: ${JSON.stringify(tokenResponse)}`)
    );
    return false;
  }

  return {
    accessToken,
    idToken,
    idTokenClaims,
    authority,
    expiresOn,
    account,
    custom: {
      sub,
      name,
      email: preferred_username,
    },
  };
};

export const createAuthController = (
  entityManager: EntityManager,
  confidentialClientAuth: ConfidentialClientApplication
) => {
  const login = async (
    req: Request & { session: CustomSessionData },
    res: Response
  ) => {
    const authCodeUrl = await confidentialClientAuth
      .getAuthCodeUrl({
        scopes: ["user.read"],
        redirectUri: getLoginRedirectUri(),
      })
      .then((url) => url)
      .catch((error) => handleError(error, "Failed to get auth code URL"));

    if (typeof authCodeUrl !== "string")
      return res.status(500).send(STATUS_CODES[500]);

    return res.status(200).redirect(authCodeUrl);
  };

  const register = async (
    req: Request & {
      session: CustomSessionData & {
        registrationCookie?: {
          roleId: Role["id"];
        };
      };
      query: { role?: Role["id"] | Role["name"] };
    },
    res: Response
  ) => {
    const role = req.query.role;

    if (!role) return res.status(400).send(`Missing query parameters: ${role}`);

    const validRoles = await entityManager.find(Role);

    if (!validRoles) return res.status(500).send(STATUS_CODES[500]);

    const [selectedRole, _] = validRoles.filter(
      (currRole) =>
        currRole.name === String(role) || currRole.id === Number(role)
    );

    if (!selectedRole)
      return res.status(400).json({
        error: "Invalid role",
        validInput: `${validRoles.map((role) => role.id)},${validRoles.map(
          (role) => role.name
        )}`,
      });

    const authCodeUrl = await confidentialClientAuth
      .getAuthCodeUrl({
        scopes: ["user.read"],
        redirectUri: getRegisterRedirectUri(),
      })
      .then((url) => url)
      .catch((error) => {
        handleError(error, "Failed to get auth code URL");
      });

    req.session.registrationCookie = { roleId: selectedRole.id };

    if (!authCodeUrl) return res.status(500).send(STATUS_CODES[500]);

    return res.status(200).redirect(authCodeUrl);
  };

  const authCallback = async (
    req: Request & { session: CustomSessionData },
    res: Response
  ) => {
    const authCode = req.query.code;

    if (!authCode) return res.status(401).send(`Missing authentication code`);

    const tokenResponse = await confidentialClientAuth
      .acquireTokenByCode({
        code: String(authCode),
        redirectUri: `${process.env.HOST_URL}:${process.env.NODE_PORT}/auth/callback`,
        scopes: ["user.read"],
      })
      .then((tokenResponse) => tokenResponse)
      .catch((error) => {
        if (error instanceof InteractionRequiredAuthError)
          return res.redirect("auth/login");

        handleError(error, "Failed to acquire token using auth code");
        throw error;
      });

    if (!tokenResponse) return res.status(401).send(STATUS_CODES[401]);

    const authCookie = buildAuthCookieFromToken(tokenResponse);

    if (!authCookie || !authCookie?.custom) {
      handleError(
        new Error("Types error while building authCookie"),
        "Check that custom authCookie fields are building correctly."
      );
      return res.status(500).send(STATUS_CODES[500]);
    }

    req.session.authCookie = authCookie;

    const userInfo = await entityManager.findOneBy(User, {
      sub: authCookie.custom.sub,
    });

    if (!userInfo)
      return res
        .status(400)
        .send("User does not exist. Please register instead.");

    return res.status(200).redirect("/api/docs");
  };

  const authCallbackRegister = async (
    req: Request & {
      session: CustomSessionData & {
        registrationCookie?: { roleId: Role["id"] };
      };
      query: { code?: string };
    },
    res: Response
  ) => {
    const authCode = req.query.code;

    if (!authCode) return res.status(401).send(`Missing authentication code`);

    const tokenResponse = await confidentialClientAuth
      .acquireTokenByCode({
        code: String(authCode),
        redirectUri: `${process.env.HOST_URL}:${process.env.NODE_PORT}/auth/callback-register`,
        scopes: ["user.read"],
      })
      .then((tokenResponse) => tokenResponse)
      .catch((error) => {
        if (error instanceof InteractionRequiredAuthError)
          return res.redirect("auth/login");

        handleError(error, "Failed to acquire token using auth code");
        throw error;
      });

    if (!tokenResponse) return res.status(401).send(STATUS_CODES[401]);

    const authCookie = buildAuthCookieFromToken(tokenResponse);

    if (!authCookie || !authCookie?.custom) {
      handleError(
        new Error("Types error while building authCookie"),
        "Check that custom authCookie fields are building correctly."
      );
      return res.status(500).send(STATUS_CODES[500]);
    }

    req.session.authCookie = authCookie;

    if (!req.session.registrationCookie) {
      handleError(new Error("Registration cookie is missing."));
      return res.status(400).json(STATUS_CODES[400]);
    }

    const { roleId } = req.session.registrationCookie;

    const userRole = await entityManager.findOneBy(Role, {
      id: roleId,
    });

    if (!userRole) {
      handleError(new Error("Invalid roleId in registration cookie."));
      return res.status(400).send(STATUS_CODES[400]);
    }

    const userConfig = {
      name: authCookie.custom.name,
      sub: authCookie.custom.sub,
      email: authCookie.custom.email,
      role: userRole,
    };

    const isExistingUser = await entityManager.findOneBy(User, {
      sub: userConfig.sub,
    });

    if (isExistingUser)
      return res.status(400).send("User already exists. Please login instead.");

    const newUser = User.createUser(userConfig);

    try {
      await entityManager.save(User, newUser);

      return res.status(200).redirect("/api/docs");
    } catch (error) {
      handleError(
        new Error("Failed to save or update registration record"),
        String(`error`),
        { req, res, status: 500 }
      );
    }
  };

  const logout = async (req: Request, res: Response) => {
    try {
      req.session.destroy((error) => {
        res.clearCookie("*");
        res.redirect("/api/docs");
      });
    } catch (error) {
      handleError(new Error(String(error)), String("Failed to logout"));
    }
  };
  return { register, authCallbackRegister, login, authCallback, logout };
};
