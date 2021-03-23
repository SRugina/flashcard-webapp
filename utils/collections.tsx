import { useState } from "react";
import useSWR from "swr";
import {
  CollectionMetadata,
  CollectionPreview,
  getCollectionResponse,
} from "../interfaces";
import { ApiError, bodyApiFetch, FetchError } from "./fetch";

export function useCollections() {
  const { data, error, mutate } = useSWR<
    Array<CollectionPreview> | false,
    FetchError
  >("/collections", bodyApiFetch, {
    focusThrottleInterval: 1000 * 60 * 15, // limit to one every 15 minutes
    errorRetryInterval: 1000 * 60 * 15, // limit to one every 15 minutes
  });

  const createCollection = async (newCol: CollectionMetadata) => {
    if (data) {
      // if data is not false, we can assume the below request will also not be false
      try {
        const col = (await bodyApiFetch<CollectionPreview>(
          "/collections",
          "POST",
          newCol
        )) as CollectionPreview;
        await mutate([col, ...data], false);
      } catch (rawErrors) {
        const errInfo = (rawErrors as FetchError).info as ApiError;
        const err = errInfo ? errInfo.error : undefined;
        if (err) {
          throw err;
        } else {
          // might occur if an unknown type of response occurs e.g. server down
          throw "Oops, something went wrong.";
        }
      }
    }
    return;
  };

  return {
    collections: data,
    colError: error,
    loading: data === undefined,
    createCollection,
  };
}

export function useCurrentCollection(id: string) {
  const { data, error, mutate } = useSWR<
    getCollectionResponse | false,
    FetchError
  >(`/collections/${id}`, bodyApiFetch, {
    focusThrottleInterval: 1000 * 60 * 15, // limit to one every 15 minutes
    errorRetryInterval: 1000 * 60 * 15, // limit to one every 15 minutes
  });
  const [updateError, setUpdateError] = useState("");
  const updateCollection = async (updatedCol: CollectionMetadata) => {
    if (data) {
      // if data is not false, we can assume the below request will also not be false
      try {
        const col = (await bodyApiFetch<CollectionPreview>(
          `/collections/${id}`,
          "PATCH",
          updatedCol
        )) as CollectionPreview;
        await mutate(
          {
            ...data,
            ...col,
          },
          false
        );
      } catch (rawErrors) {
        const errInfo = (rawErrors as FetchError).info as ApiError;
        const err = errInfo ? errInfo.error : undefined;
        if (err) {
          setUpdateError(err);
        } else {
          // might occur if an unknown type of response occurs e.g. server down
          setUpdateError("Oops, something went wrong.");
        }
      }
    }
    return;
  };

  return {
    collections: data,
    colError: error,
    loading: data === undefined,
    updateCollection,
    updateError,
  };
}
