import fetch from "isomorphic-unfetch";
import {
  compressToEncodedURIComponent,
  decompressFromEncodedURIComponent,
} from "lz-string";

export interface FetchError {
  status: number;
  info: any;
}

export interface ApiError {
  error: string;
}

const genericFetch = async <JSON = any>(
  input: RequestInfo,
  init?: RequestInit
): Promise<JSON> => {
  const res = await fetch(input, init);
  // If the status code is not in the range 200-299,
  // we still try to parse and throw it.
  if (!res.ok) {
    throw {
      status: res.status,
      info: (await res.json()) as unknown,
    } as FetchError;
  }
  return res.json() as Promise<JSON>;
};

export default genericFetch;

export const apiFetch = async <JSON = any>(
  input: RequestInfo,
  init?: RequestInit
): Promise<JSON | false> => {
  return genericFetch<JSON>(
    `${process.env.NEXT_PUBLIC_API_URL as string}${input as string}`,
    {
      ...init,
      credentials: "include",
    }
  ).catch((err) => {
    const error = err as FetchError;
    if (error.status === 401) return false;
    throw error;
  });
};

/**
 * apiFetch that stringifies JSON body
 */
export const bodyApiFetch = async <JSON = any>(
  path: string,
  method: RequestInit["method"],
  body?: any
): Promise<JSON | false> => {
  return apiFetch<JSON>(path, {
    method: method,
    headers: {
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
};

/**
 * bodyApiFetch that decompresses the received body and compresses the sent body
 */
export const decompressBodyApiFetch = async <JSON = any>(
  path: string,
  method: RequestInit["method"],
  body?: any
): Promise<JSON | false> => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL as string}${path}`,
      {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: body
          ? compressToEncodedURIComponent(JSON.stringify(body))
          : undefined,
        credentials: "include",
      }
    );
    // If the status code is not in the range 200-299,
    // we still try to parse and throw it.
    if (!res.ok) {
      throw {
        status: res.status,
        info: (await res.json()) as unknown,
      } as FetchError;
    }
    const raw = await res.text();
    // new flashcards do not have their empty array compressed
    if (raw === "[]") return JSON.parse(raw) as JSON;
    const data = decompressFromEncodedURIComponent(raw);
    return JSON.parse(data!) as JSON;
  } catch (err) {
    const error = err as FetchError;
    if (error.status === 401) return false;
    throw error;
  }
};
