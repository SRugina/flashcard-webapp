import { useEffect, useState } from "react";
import useSWR from "swr";
import {
  CollectionMetadata,
  CollectionPreview,
  FlashcardMetadata,
  FlashcardPreview,
  getCollectionResponse,
  getSubCollectionResponse,
  SubCollectionMetadata,
  SubCollectionPreview,
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
  const [colError, setColError] = useState("");
  useEffect(() => {
    const errInfo = error ? (error.info as ApiError) : undefined;
    const err = errInfo ? errInfo.error : undefined;
    if (err) {
      setColError(err);
    } else {
      // might occur if an unknown type of response occurs e.g. server down
      setColError("Oops, something went wrong.");
    }
  }, [error]);

  const createCollection = async (newCol: CollectionMetadata) => {
    if (data) {
      // if data is not false, we can assume the below request will also not be false
      try {
        if (!newCol.title) {
          const err: FetchError = {
            status: 400,
            info: { error: "Missing collection title" },
          };
          throw err;
        }
        if (newCol.title.length === 0 || newCol.title.length > 60) {
          const err: FetchError = {
            status: 400,
            info: {
              error: "Title must have length of at least 1 but no more than 60",
            },
          };
          throw err;
        }
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
    colError,
    loading: data === undefined,
    createCollection,
  };
}

export function useCurrentCollection(
  id: string,
  isSub = false,
  subId?: string
) {
  const { data, error, mutate } = useSWR<
    getCollectionResponse | getSubCollectionResponse | false,
    FetchError
  >(
    isSub
      ? `/collections/${id}/subcollections/${subId!}`
      : `/collections/${id}`,
    bodyApiFetch,
    {
      focusThrottleInterval: 1000 * 60 * 15, // limit to one every 15 minutes
      errorRetryInterval: 1000 * 60 * 15, // limit to one every 15 minutes
    }
  );

  useEffect(() => console.warn("Collection in hook: ", data, error), [
    data,
    error,
  ]);

  const [colError, setColError] = useState("");
  useEffect(() => {
    const errInfo = error ? (error.info as ApiError) : undefined;
    const err = errInfo ? errInfo.error : undefined;
    if (err) {
      setColError(err);
    } else {
      // might occur if an unknown type of response occurs e.g. server down
      setColError("Oops, something went wrong.");
    }
  }, [error]);

  const updateCollection = async (
    updatedCol: CollectionMetadata | SubCollectionMetadata
  ) => {
    if (data) {
      // if data is not false, we can assume the below request will also not be false
      try {
        if (!updatedCol.title) {
          const err: FetchError = {
            status: 400,
            info: { error: "Missing collection title" },
          };
          throw err;
        }
        if (updatedCol.title.length === 0 || updatedCol.title.length > 60) {
          const err: FetchError = {
            status: 400,
            info: {
              error: "Title must have length of at least 1 but no more than 60",
            },
          };
          throw err;
        }
        // silent fail if unchanged
        if (updatedCol.title === data.title) return;

        const col = (await bodyApiFetch<
          CollectionPreview | SubCollectionPreview
        >(
          isSub
            ? `/collections/${id}/subcollections/${subId!}`
            : `/collections/${id}`,
          "PATCH",
          updatedCol
        )) as CollectionPreview | SubCollectionPreview;
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
          throw err;
        } else {
          // might occur if an unknown type of response occurs e.g. server down
          throw "Oops, something went wrong.";
        }
      }
    }
    return;
  };

  const addSubCollection = async (newSubCol: SubCollectionMetadata) => {
    if (data && !isSub) {
      // if data is not false, we can assume the below request will also not be false
      try {
        if (!newSubCol.title) {
          const err: FetchError = {
            status: 400,
            info: { error: "Missing sub-collection title" },
          };
          throw err;
        }
        if (newSubCol.title.length === 0 || newSubCol.title.length > 60) {
          const err: FetchError = {
            status: 400,
            info: {
              error: "Title must have length of at least 1 but no more than 60",
            },
          };
          throw err;
        }

        const subCol = (await bodyApiFetch<CollectionPreview>(
          `/collections/${id}/subcollections`,
          "POST",
          newSubCol
        )) as SubCollectionPreview;
        await mutate(
          {
            ...data,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            subCollectionData: [
              subCol,
              ...(data as getCollectionResponse).subCollectionData,
            ],
          },
          false
        );
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
  const addFlashcard = async (newCard: FlashcardMetadata) => {
    if (data) {
      // if data is not false, we can assume the below request will also not be false
      try {
        if (!newCard.title) {
          const err: FetchError = {
            status: 400,
            info: { error: "Missing flashcard title" },
          };
          throw err;
        }
        if (newCard.title.length === 0 || newCard.title.length > 60) {
          const err: FetchError = {
            status: 400,
            info: {
              error: "Title must have length of at least 1 but no more than 60",
            },
          };
          throw err;
        }

        const flashcard = (await bodyApiFetch<CollectionPreview>(
          isSub
            ? `/collections/${id}/subcollections/${subId!}/flashcards`
            : `/collections/${id}/flashcards`,
          "POST",
          newCard
        )) as FlashcardPreview;
        await mutate(
          {
            ...data,
            flashcardData: [flashcard, ...data.flashcardData],
          },
          false
        );
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
    collection: data,
    colError,
    loading: data === undefined,
    updateCollection,
    addSubCollection,
    addFlashcard,
  };
}
