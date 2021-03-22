export interface ApiRequest extends Request {
  userId?: string;
  username?: string;
  sessionId?: string;
  params?: unknown;
}

export const getCookie = (request: ApiRequest, name: string) => {
  const cookieString = request.headers.get("Cookie");
  const cookies = (cookieString || "").split(";");

  let cookieContents = "";
  cookies.forEach((cookie) => {
    const cookiePair = cookie.split("=", 2);
    const cookieName = cookiePair[0].trim();
    if (cookieName === name) {
      const cookieVal = cookiePair[1];
      cookieContents = cookieVal;
    }
  });
  return cookieContents;
};

export const formatIdFromKey = (key: string) => {
  const keyParts = key.split(":");
  return keyParts[keyParts.length - 1];
};
