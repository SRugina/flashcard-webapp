import { formatIdFromKey } from "./api";
import { encodeHex, random128bit } from "./crypto";
import { formatUsernameFromKey } from "../UserController";
import "./namespaces";
import { Self } from "../../interfaces";

const ONE_MONTH_SECONDS = 1 * 60 * 60 * 24 * 28;

export const newSessionId = async (key: string) => {
  const sessionId = encodeHex(random128bit());
  await Sessions.put(sessionId, key, {
    expirationTtl: ONE_MONTH_SECONDS,
  });

  const self: Self = {
    id: formatIdFromKey(key),
    username: formatUsernameFromKey(key),
  };

  const res = new Response(JSON.stringify(self));
  // expires in 1 month
  res.headers.set(
    "Set-Cookie",
    `primary=${sessionId}; Max-Age=${ONE_MONTH_SECONDS}; HttpOnly; Path=/; SameSite=Lax; Secure;`
  );
  return res;
};

export const clearSessionId = async (sessionId: string) => {
  await Sessions.delete(sessionId);
  const res = new Response(JSON.stringify({ success: true }));
  // Max-Age <= 0 deletes the cookie
  res.headers.set(
    "Set-Cookie",
    `primary=${""}; Max-Age=${-1}; HttpOnly; Path=/; SameSite=Lax; Secure;`
  );
  return res;
};
