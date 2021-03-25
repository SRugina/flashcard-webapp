import { Router } from "itty-router";
import { encodeHex, random128bit, hash, verify } from "./utils/crypto";
import { ApiRequest, formatIdFromKey, getCookie } from "./utils/api";
import { newSessionId, clearSessionId } from "./utils/sessions";
import "./utils/namespaces";
import {
  NewUserData,
  UpdateUserData,
  UpdateUserPasswordData,
  UserMetadata,
} from "../interfaces";

const UserController = Router({ base: "/api/users" });

/*
 * The key used at the start of all other namespaces
 */
export const formatUserKey = (request: ApiRequest) => {
  return `user:${request.userId!}`;
};

/*
 * The key used in the Users namespace
 */
const formatKeyFromUsernameId = (username: string, id: string) => {
  return `${username}:${id}`;
};

export const formatUsernameFromKey = (key: string) => {
  return key.split(":")[0];
};

const create = async (request: Request) => {
  const body = (await request.json()) as NewUserData;
  if (!body.username || !body.password) {
    return new Response(
      JSON.stringify({ error: "Missing username and/or password" }),
      { status: 400 }
    );
  }
  if (body.username.length === 0 || body.username.length > 20) {
    return new Response(
      JSON.stringify({
        error: "Username must have length of at least 1 but no more than 20",
      }),
      { status: 400 }
    );
  }
  if (body.username.includes(":")) {
    return new Response(
      JSON.stringify({
        error: 'Username cannot contain a colon (":")',
      }),
      { status: 400 }
    );
  }

  if (body.password.length < 10) {
    return new Response(
      JSON.stringify({ error: "Password must be at least of length 10" }),
      { status: 400 }
    );
  }

  const passwordHash = await hash(body.password);

  const userList = (await Users.list({ prefix: `${body.username}:` })).keys;
  if (userList.length > 0) {
    return new Response(JSON.stringify({ error: "Username already exists" }), {
      status: 422,
    });
  }

  const id = encodeHex(random128bit());

  await Users.put(formatKeyFromUsernameId(body.username, id), "", {
    metadata: { id, password: passwordHash },
  });

  return newSessionId(`${body.username}:${id}`);
};

const login = async (request: Request) => {
  const body = (await request.clone().json()) as NewUserData;
  if (!body.username || !body.password) {
    return new Response(
      JSON.stringify({ error: "Missing username and/or password" }),
      { status: 400 }
    );
  }
  if (body.username.length === 0 || body.username.length > 20) {
    return new Response(
      JSON.stringify({
        error: "Username must have length of at least 1 but no more than 20",
      }),
      { status: 400 }
    );
  }
  if (body.username.includes(":")) {
    return new Response(
      JSON.stringify({
        error: 'Username cannot contain a colon (":")',
      }),
      { status: 400 }
    );
  }
  if (body.password.length < 10) {
    return new Response(
      JSON.stringify({ error: "Password must be at least of length 10" }),
      { status: 400 }
    );
  }

  const userList = (await Users.list({ prefix: `${body.username}:` })).keys;

  let user: { id: string; password: string };
  if (userList.length === 0) {
    user = { id: "0", password: "" };
  } else {
    user = userList[0].metadata as UserMetadata;
  }

  const same = await verify(body.password, user.password);

  if (!same)
    return new Response(
      JSON.stringify({ error: "Username and/or password incorrect" }),
      { status: 422 }
    );

  return newSessionId(`${body.username}:${user.id}`);
};

const logout = (request: ApiRequest) => {
  return clearSessionId(request.sessionId!);
};

const getSelf = (request: ApiRequest) => {
  return new Response(
    JSON.stringify({ id: request.userId, username: request.username })
  );
};

const updateSelf = async (request: ApiRequest) => {
  const body = (await request.json()) as UpdateUserData;
  if (!body.username) {
    return new Response(JSON.stringify({ error: "Missing username" }), {
      status: 400,
    });
  }
  if (body.username.length === 0 || body.username.length > 20) {
    return new Response(
      JSON.stringify({
        error: "Username must have length of at least 1 but no more than 20",
      }),
      { status: 400 }
    );
  }
  if (body.username.includes(":")) {
    return new Response(
      JSON.stringify({
        error: 'Username cannot contain a colon (":")',
      }),
      { status: 400 }
    );
  }

  if (body.username === request.username!) {
    return new Response(
      JSON.stringify({ success: true, message: "Username unchanged" })
    );
  }

  const oldKey = formatKeyFromUsernameId(request.username!, request.userId!);
  const newKey = formatKeyFromUsernameId(body.username, request.userId!);

  const metadata = (await Users.getWithMetadata<UserMetadata>(oldKey, "stream"))
    .metadata;

  await Users.delete(oldKey);
  await Sessions.delete(request.sessionId!);

  await Users.put(newKey, "", {
    metadata: metadata,
  });

  return newSessionId(newKey);
};

const updateSelfPassword = async (request: ApiRequest) => {
  const body = (await request.json()) as UpdateUserPasswordData;
  if (!body.oldPassword) {
    return new Response(JSON.stringify({ error: "Missing old password" }), {
      status: 400,
    });
  }
  if (!body.password) {
    return new Response(JSON.stringify({ error: "Missing new password" }), {
      status: 400,
    });
  }

  if (body.oldPassword === body.password) {
    return new Response(
      JSON.stringify({ success: true, message: "Password unchanged" })
    );
  }

  const key = formatKeyFromUsernameId(request.username!, request.userId!);

  await Users.put(key, "", {
    metadata: { id: request.userId!, password: hash(body.password) },
  });

  return new Response(JSON.stringify({ success: true }));
};

const deleteSelf = async (request: ApiRequest) => {
  await Sessions.delete(request.sessionId!);
  await Users.delete(
    formatKeyFromUsernameId(request.username!, request.userId!)
  );

  const collections = (
    await Collections.list({
      prefix: `${formatUserKey(request)}:`,
    })
  ).keys;
  for (const collection of collections) {
    await Collections.delete(collection.name);
  }

  const subCollections = (
    await SubCollections.list({
      prefix: `${formatUserKey(request)}:`,
    })
  ).keys;
  for (const subCollection of subCollections) {
    await SubCollections.delete(subCollection.name);
  }

  const flashcards = (
    await Flashcards.list({
      prefix: `${formatUserKey(request)}:`,
    })
  ).keys;
  for (const flashcard of flashcards) {
    await Flashcards.delete(flashcard.name);
  }

  return new Response(JSON.stringify({ success: true }));
};

export const withUser = async (request: ApiRequest) => {
  const sessionId = getCookie(request, "primary");
  if (!sessionId) {
    return new Response(JSON.stringify({ error: "User Auth Required" }), {
      status: 401,
    });
  }

  const self = await Sessions.get(sessionId, "text");

  if (!self) {
    await clearSessionId(sessionId);
    return new Response(JSON.stringify({ error: "User Auth Required" }), {
      status: 401,
    });
  }
  request.userId = formatIdFromKey(self);
  request.username = formatUsernameFromKey(self);
  request.sessionId = sessionId;
};

export const withoutUser = (request: ApiRequest) => {
  const sessionId = getCookie(request, "primary");
  if (sessionId !== "") {
    return new Response(
      JSON.stringify({ error: "Only signed out users can access" }),
      {
        status: 401,
      }
    );
  }
};

UserController.post("/", withoutUser, create)
  .post("/login", withoutUser, login)
  .get("/logout", withUser, logout)
  .get("/self", withUser, getSelf)
  .patch("/self", withUser, updateSelf)
  .patch("/self/password", withUser, updateSelfPassword)
  .delete("/self", withUser, deleteSelf);

export default UserController;
