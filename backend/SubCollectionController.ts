import { ApiRequest, formatIdFromKey } from "./utils/api";
import "./utils/namespaces";
import {
  SubCollectionPreview,
  SubCollectionMetadata,
  FlashcardMetadata,
  FlashcardPreview,
  getSubCollectionResponse,
} from "../interfaces";
import { encodeHex, random128bit } from "./utils/crypto";
import { formatCollectionKey } from "./CollectionController";

export const formatSubCollectionKey = (
  request: ApiRequest,
  colId: string,
  subId: string
) => {
  return `${formatCollectionKey(request, colId)}:sub:${subId}`;
};

export const createSubCollection = async (request: ApiRequest) => {
  const params = request.params as { colId: string };
  const body = (await request.json()) as SubCollectionMetadata;
  if (!body.title) {
    return new Response(
      JSON.stringify({ error: "Missing subCollection title" }),
      {
        status: 400,
      }
    );
  }
  if (body.title.length === 0) {
    return new Response(
      JSON.stringify({ error: "SubCollection title cannot be empty" }),
      {
        status: 400,
      }
    );
  }

  const id = encodeHex(random128bit());

  const newData: SubCollectionPreview = {
    id,
    title: body.title,
  };

  await SubCollections.put(
    formatSubCollectionKey(request, params.colId, newData.id),
    "",
    {
      metadata: { title: newData.title },
    }
  );

  return new Response(JSON.stringify(newData));
};

export const getSubCollection = async (request: ApiRequest) => {
  const params = request.params as { colId: string; subColId: string };
  const subCollectionTitle = (
    await SubCollections.getWithMetadata<SubCollectionMetadata>(
      formatSubCollectionKey(request, params.colId, params.subColId),
      "stream"
    )
  ).metadata?.title;

  if (!subCollectionTitle) {
    return new Response(
      JSON.stringify({ error: "SubCollection does not exist" }),
      { status: 404 }
    );
  }

  const subCollections = (
    await SubCollections.list({
      prefix: `${formatSubCollectionKey(
        request,
        params.colId,
        params.subColId
      )}:`,
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
      prefix: `${formatSubCollectionKey(
        request,
        params.colId,
        params.subColId
      )}:`,
    })
  ).keys;

  const flashcardData: Array<FlashcardPreview> = [];
  for (const flashcard of flashcards) {
    const metadata = flashcard.metadata as FlashcardMetadata;
    flashcardData.push({
      id: formatIdFromKey(flashcard.name),
      ...metadata,
    });
  }

  const res: getSubCollectionResponse = {
    id: params.subColId,
    title: subCollectionTitle,
    subCollectionData,
    flashcardData,
  };

  return new Response(JSON.stringify(res));
};

export const updateSubCollection = async (request: ApiRequest) => {
  const body = (await request.json()) as SubCollectionMetadata;
  if (!body.title) {
    return new Response(JSON.stringify({ error: "Missing title" }), {
      status: 400,
    });
  }

  const params = request.params as { colId: string; subColId: string };
  const subCollectionTitle = (
    await SubCollections.getWithMetadata<SubCollectionMetadata>(
      formatSubCollectionKey(request, params.colId, params.subColId),
      "stream"
    )
  ).metadata?.title;

  if (!subCollectionTitle) {
    return new Response(
      JSON.stringify({ error: "SubCollection does not exist" }),
      { status: 404 }
    );
  }

  if (body.title === subCollectionTitle) {
    return new Response(
      JSON.stringify({ success: true, message: "SubCollection unchanged" })
    );
  }

  const newData: SubCollectionPreview = {
    id: params.subColId,
    title: body.title,
  };

  await SubCollections.put(
    formatSubCollectionKey(request, newData.id, params.subColId),
    "",
    {
      metadata: { title: newData.title },
    }
  );

  return new Response(JSON.stringify(newData));
};

export const deleteSubCollection = async (request: ApiRequest) => {
  const params = request.params as { colId: string; subColId: string };

  await SubCollections.delete(
    formatSubCollectionKey(request, params.colId, params.subColId)
  );

  const subCollections = (
    await SubCollections.list({
      prefix: `${formatSubCollectionKey(
        request,
        params.colId,
        params.subColId
      )}:`,
    })
  ).keys;
  for (const subCollection of subCollections) {
    await SubCollections.delete(subCollection.name);
  }

  const flashcards = (
    await Flashcards.list({
      prefix: `${formatSubCollectionKey(
        request,
        params.colId,
        params.subColId
      )}:`,
    })
  ).keys;
  for (const flashcard of flashcards) {
    await Flashcards.delete(flashcard.name);
  }

  return new Response(JSON.stringify({ success: true }));
};
