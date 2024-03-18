import { AuthenticationResult } from "@azure/msal-node";

export interface AuthOptions {
  successRedirect: string;
  scopes: string[];
  redirectUri: string;
  postLogoutRedirectUri: string;
}

export interface MsalCustomCookie {
  sub: string;
  email: string;
  name: string;
}

export interface ApiCookie {
  userId: number;
  email: string;
  name: string;
  roleId: number;
}

export interface CustomSessionData {
  authCookie?: MsalAuthCookie;
  apiCookie?: ApiCookie;
}

export interface MsalAuthCookie {
  accessToken: AuthenticationResult["accessToken"];
  idToken: AuthenticationResult["idToken"];
  account: AuthenticationResult["account"];
  idTokenClaims: AuthenticationResult["idTokenClaims"];
  authority: AuthenticationResult["authority"];
  expiresOn: AuthenticationResult["expiresOn"];
  custom?: MsalCustomCookie;
}
