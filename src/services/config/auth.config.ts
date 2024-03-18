export const msalConfig = () => ({
  auth: {
    clientId: `${process.env.AZURE_CLIENT_ID}`,
    // authority: `https://login.microsoftonline.com/${process.env.AZURE_TENANT_ID}`, // Single-Tenant
    authority: "https://login.microsoftonline.com/common", // Multi-Tenant
    clientSecret: process.env.AZURE_CLIENT_SECRET,
  },
});

export const REDIRECT_URI = process.env.REDIRECT_URI;
export const POST_LOGOUT_REDIRECT_URI = process.env.POST_LOGOUT_REDIRECT_URI;
export const GRAPH_ME_ENDPOINT = process.env.GRAPH_API_ENDPOINT + "v1.0/me";

export const MS_COMMON_AUTH_ENDPOINT =
  "https://login.microsoftonline.com/common/oauth2/v2.0/authorize";

export const getRegisterRedirectUri = () =>
  `${process.env.HOST_URL}:${process.env.NODE_PORT}/auth/callback-register`;

export const getLoginRedirectUri = () =>
  `${process.env.HOST_URL}:${process.env.NODE_PORT}/auth/callback`;

export const getSilentLoginRedirectUri = () =>
  `${process.env.HOST_URL}:${process.env.NODE_PORT}/auth/callback-silent`;

export const getLogoutUrl = () =>
  `https://prancingpony.pixelscape.co.za/auth/logout`;

export const getRegisterRedirectUriCommon = () =>
  `${MS_COMMON_AUTH_ENDPOINT}` +
  `?client_id=${process.env.AZURE_CLIENT_ID}` +
  `&response_type=${"code"}` +
  `&redirect_uri=${getRegisterRedirectUri()}` +
  `&response_mode=${"query"}` +
  `&scope=${"https://graph.microsoft.com/.default"}`;

export const getLoginRedirectUriCommon = () =>
  `${MS_COMMON_AUTH_ENDPOINT}` +
  `?client_id=${process.env.AZURE_CLIENT_ID}` +
  `&response_type=${"code"}` +
  `&redirect_uri=${getLoginRedirectUri()}` +
  `&response_mode=${"query"}` +
  `&scope=${"https://graph.microsoft.com/.default"}`;
