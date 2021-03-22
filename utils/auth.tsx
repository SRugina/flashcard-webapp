import { useRouter } from "next/router";
import useSWR from "swr";
import {
  NewUserData,
  Self,
  UpdateUserData,
  UpdateUserPasswordData,
} from "../interfaces";
import { apiFetch, bodyApiFetch, FetchError } from "./fetch";

export function useSelf() {
  const router = useRouter();
  const { data, error, mutate } = useSWR<Self | false, FetchError>(
    "/users/self",
    apiFetch,
    {
      focusThrottleInterval: 1000 * 60 * 15, // limit to one every 15 minutes
      errorRetryInterval: 1000 * 60 * 15, // limit to one every 15 minutes
    }
  );
  const logout = async () => {
    // update the local data immediately, but disable the revalidation
    await mutate(false, false);

    // send a request to the API to clear our session
    await apiFetch("/users/logout");
    return;
  };
  const login = async (username: string, password: string) => {
    await mutate(
      bodyApiFetch("/users/login", "POST", { username, password }),
      false
    );
    return;
  };
  const signup = async (newUser: NewUserData) => {
    await mutate(bodyApiFetch("/users", "POST", newUser), false);
    return;
  };
  const del = async () => {
    try {
      await apiFetch("/users/self", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      // update the local data immediately, but disable the revalidation
      await mutate(false, false);
      return;
    } catch (err) {
      const error = err as FetchError;
      // No specific errors expected, if occurs then we don't know the
      // format, so throw info as-is
      throw error.info;
    }
  };
  const updateSelf = async (updateUser: UpdateUserData) => {
    await mutate(bodyApiFetch("/users/self", "PATCH", updateUser), false);
  };
  const updatePassword = async (updateUserPassword: UpdateUserPasswordData) => {
    await mutate(
      bodyApiFetch("/users/self/password", "PATCH", updateUserPassword),
      false
    );
    return;
  };

  const protectRoute = () => {
    if (error || data === false) {
      void router.push("/login");
    }
  };

  return {
    self: data,
    selfError: error,
    loading: data === undefined,
    protectRoute,
    logout,
    login,
    signup,
    del,
    updateSelf,
    updatePassword,
  };
}
