import { Router } from "itty-router";
import UserController from "./UserController";
import CollectionController from "./CollectionController";
import "./utils/namespaces";
import "./utils/secrets";

const router = Router();

const withJson = (request: Request) => {
  const contentType = request.headers.get("Content-Type") || "";
  if (
    !(request.method === "GET") &&
    !contentType.includes("application/json")
  ) {
    return new Response(
      JSON.stringify({ error: "Expected JSON Content-Type" })
    );
  }
};

router
  .all("*", withJson)
  .all("/users/*", UserController.handle)
  .all("/collections/*", CollectionController.handle)
  .all("*", () => new Response("WompWomp", { status: 404 }));

// eslint-disable-next-line @typescript-eslint/no-unsafe-return
export const handleRequest = async (request: Request) => {
  const res = (await router.handle(request)) as Response;
  res.headers.set("Access-Control-Allow-Credentials", "true");
  res.headers.set("Access-Control-Allow-Origin", FRONTEND_ORIGIN_URL);
  res.headers.set("Access-Control-Allow-Headers", "content-type");
  res.headers.set("Access-Control-Allow-Methods", "GET,POST,DELETE,PATCH");
  res.headers.set("Content-Type", "application/json;charset=UTF-8");
  res.headers.append("Vary", "Origin"); // https://developers.cloudflare.com/workers/examples/cors-header-proxy
  return res;
};
