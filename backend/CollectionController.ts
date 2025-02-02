import { Router } from "itty-router";
import { formatUserKey, withUser } from "./UserController";
import {
  ApiRequest,
  formatIdFromKey,
  formatIdWithSubFromKey,
} from "./utils/api";
import "./utils/namespaces";
import {
  CollectionPreview,
  CollectionMetadata,
  SubCollectionPreview,
  SubCollectionMetadata,
  FlashcardMetadata,
  FlashcardPreview,
  getCollectionResponse,
  getAllFlashcardsResponse,
} from "../interfaces";
import { encodeHex, random128bit } from "./utils/crypto";
import {
  createFlashcard,
  getFlashcardPreview,
  getFlashcardLayers,
  updateFlashcardTitle,
  updateFlashcardLayers,
  deleteFlashcard,
} from "./FlashcardController";
import {
  createSubCollection,
  getSubCollection,
  updateSubCollection,
  deleteSubCollection,
} from "./SubCollectionController";

const CollectionController = Router({ base: "/api/collections" });

export const formatCollectionKey = (request: ApiRequest, colId: string) => {
  return `${formatUserKey(request)}:col:${colId}`;
};

const getAllCollections = async (request: ApiRequest) => {
  const list = (await Collections.list({ prefix: `user:${request.userId!}:` }))
    .keys;

  const data: Array<CollectionPreview> = [];
  for (const collection of list) {
    const metadata = collection.metadata as CollectionMetadata;
    data.push({ id: formatIdFromKey(collection.name), ...metadata });
  }
  return new Response(JSON.stringify(data));
};

const createCollection = async (request: ApiRequest) => {
  const body = (await request.json()) as CollectionMetadata;
  if (!body.title) {
    return new Response(JSON.stringify({ error: "Missing collection title" }), {
      status: 400,
    });
  }
  if (body.title.length === 0 || body.title.length > 60) {
    return new Response(
      JSON.stringify({
        error: "Title must have length of at least 1 but no more than 60",
      }),
      {
        status: 400,
      }
    );
  }

  const id = encodeHex(random128bit());

  const newData: CollectionPreview = {
    id,
    title: body.title,
  };

  await Collections.put(formatCollectionKey(request, newData.id), "", {
    metadata: { title: newData.title },
  });

  return new Response(JSON.stringify(newData));
};

const getCollection = async (request: ApiRequest) => {
  const params = request.params as { colId: string };
  const collectionTitle = (
    await Collections.getWithMetadata<CollectionMetadata>(
      formatCollectionKey(request, params.colId),
      "stream"
    )
  ).metadata?.title;

  if (!collectionTitle) {
    return new Response(
      JSON.stringify({ error: "Collection does not exist" }),
      { status: 404 }
    );
  }

  const subCollections = (
    await SubCollections.list({
      prefix: `${formatCollectionKey(request, params.colId)}:`,
    })
  ).keys;

  const subCollectionData: Array<SubCollectionPreview> = [];
  for (const subCollection of subCollections) {
    const metadata = subCollection.metadata as SubCollectionMetadata;
    subCollectionData.push({
      id: formatIdFromKey(subCollection.name),
      ...metadata,
    });
  }

  const flashcards = (
    await Flashcards.list({
      prefix: `${formatCollectionKey(request, params.colId)}:`,
    })
  ).keys.filter((key) => key.name.split(":").length === 6); // only show flashcards that do not belong to sub-collections

  const flashcardData: Array<FlashcardPreview> = [];
  for (const flashcard of flashcards) {
    const metadata = flashcard.metadata as FlashcardMetadata;
    flashcardData.push({
      id: formatIdFromKey(flashcard.name),
      ...metadata,
    });
  }

  const res: getCollectionResponse = {
    id: params.colId,
    title: collectionTitle,
    subCollectionData,
    flashcardData,
  };

  return new Response(JSON.stringify(res));
};

const getAllCollectionFlashcards = async (request: ApiRequest) => {
  const params = request.params as { colId: string };
  const collectionTitle = (
    await Collections.getWithMetadata<CollectionMetadata>(
      formatCollectionKey(request, params.colId),
      "stream"
    )
  ).metadata?.title;

  if (!collectionTitle) {
    return new Response(
      JSON.stringify({ error: "Collection does not exist" }),
      { status: 404 }
    );
  }

  const flashcards = (
    await Flashcards.list({
      prefix: `${formatCollectionKey(request, params.colId)}:`,
    })
  ).keys; // no filter, so shows flashcards in sub-collections too

  const flashcardData: Array<FlashcardPreview> = [];
  for (const flashcard of flashcards) {
    const metadata = flashcard.metadata as FlashcardMetadata;
    flashcardData.push({
      id:
        flashcard.name.split(":").length === 6
          ? formatIdFromKey(flashcard.name)
          : formatIdWithSubFromKey(flashcard.name),
      ...metadata,
    });
  }

  const res: getAllFlashcardsResponse = {
    id: params.colId,
    title: collectionTitle,
    flashcardData,
  };

  return new Response(JSON.stringify(res));
};

const updateCollection = async (request: ApiRequest) => {
  const body = (await request.json()) as CollectionMetadata;
  if (!body.title) {
    return new Response(JSON.stringify({ error: "Missing title" }), {
      status: 400,
    });
  }
  if (body.title.length === 0 || body.title.length > 60) {
    return new Response(
      JSON.stringify({
        error: "Title must have length of at least 1 but no more than 60",
      }),
      {
        status: 400,
      }
    );
  }

  const params = request.params as { colId: string };
  const collectionTitle = (
    await Collections.getWithMetadata<CollectionMetadata>(
      formatCollectionKey(request, params.colId),
      "stream"
    )
  ).metadata?.title;

  if (!collectionTitle) {
    return new Response(
      JSON.stringify({ error: "Collection does not exist" }),
      { status: 404 }
    );
  }

  const newData: CollectionPreview = {
    id: params.colId,
    title: body.title,
  };

  if (body.title !== collectionTitle) {
    await Collections.put(formatCollectionKey(request, newData.id), "", {
      metadata: { title: newData.title },
    });
  }

  return new Response(JSON.stringify(newData));
};

const deleteCollection = async (request: ApiRequest) => {
  const params = request.params as { colId: string };

  await Collections.delete(formatCollectionKey(request, params.colId));

  const subCollections = (
    await SubCollections.list({
      prefix: `${formatCollectionKey(request, params.colId)}:`,
    })
  ).keys;
  for (const subCollection of subCollections) {
    await SubCollections.delete(subCollection.name);
  }

  const flashcards = (
    await Flashcards.list({
      prefix: `${formatCollectionKey(request, params.colId)}:`,
    })
  ).keys;
  for (const flashcard of flashcards) {
    await Flashcards.delete(flashcard.name);
  }

  return new Response(JSON.stringify({ success: true }));
};

CollectionController.get("/", withUser, getAllCollections)
  .post("/", withUser, createCollection)
  .get("/:colId", withUser, getCollection)
  .patch("/:colId", withUser, updateCollection)
  .delete("/:colId", withUser, deleteCollection)
  .get("/:colId/flashcards/", withUser, getAllCollectionFlashcards)
  .post("/:colId/flashcards/", withUser, createFlashcard)
  .get("/:colId/flashcards/:cardId/preview", withUser, getFlashcardPreview)
  .get("/:colId/flashcards/:cardId/layers", withUser, getFlashcardLayers)
  .patch("/:colId/flashcards/:cardId/title", withUser, updateFlashcardTitle)
  .patch("/:colId/flashcards/:cardId/layers", withUser, updateFlashcardLayers)
  .delete("/:colId/flashcards/:cardId", withUser, deleteFlashcard)
  .post("/:colId/subcollections/", withUser, createSubCollection)
  .get("/:colId/subcollections/:subColId", withUser, getSubCollection)
  .patch("/:colId/subcollections/:subColId", withUser, updateSubCollection)
  .delete("/:colId/subcollections/:subColId", withUser, deleteSubCollection)
  .post(
    "/:colId/subcollections/:subColId/flashcards/",
    withUser,
    createFlashcard
  )
  .get(
    "/:colId/subcollections/:subColId/flashcards/:cardId/preview",
    withUser,
    getFlashcardPreview
  )
  .get(
    "/:colId/subcollections/:subColId/flashcards/:cardId/layers",
    withUser,
    getFlashcardLayers
  )
  .patch(
    "/:colId/subcollections/:subColId/flashcards/:cardId/title",
    withUser,
    updateFlashcardTitle
  )
  .patch(
    "/:colId/subcollections/:subColId/flashcards/:cardId/layers",
    withUser,
    updateFlashcardLayers
  )
  .delete(
    "/:colId/subcollections/:subColId/flashcards/:cardId",
    withUser,
    deleteFlashcard
  );

export default CollectionController;
