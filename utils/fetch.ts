import fetch from "isomorphic-unfetch";

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
 * apiFetch that does more processing of the error
 */
export const bodyApiFetch = async <JSON = any>(
  path: string,
  method: RequestInit["method"],
  body?: any
): Promise<JSON | false> => {
  try {
    return apiFetch<JSON>(path, {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch (err) {
    const error = err as FetchError;
    if ([400, 422, 404].includes(error.status)) {
      // our backend code sent the error
      throw (error.info as ApiError).error;
    } else {
      // only 422 (unprocessable entity), 400 (badrequesterror) or 401 (unauthorized)
      // are expected, else occurs then we don't know the format, so throw
      // info as-is
      throw error;
    }
  }
};
