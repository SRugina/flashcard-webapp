import fetch from "isomorphic-unfetch";

export default async function (...args: any[]) {
  // @ts-ignore: Expected 1-2 arguments, but got 0 or more.
  const res = await fetch(...args);
  return res.json();
}
