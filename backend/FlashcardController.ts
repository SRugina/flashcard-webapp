import { ApiRequest } from "./utils/api";
import "./utils/namespaces";
import {
  FlashcardMetadata,
  FlashcardObject,
  FlashcardPreview,
} from "../interfaces";
import { encodeHex, random128bit } from "./utils/crypto";
import { formatCollectionKey } from "./CollectionController";
import { formatSubCollectionKey } from "./SubCollectionController";

export const formatFlashcardKey = (request: ApiRequest) => {
  const params = request.params as { [k: string]: string };
  if (params.subColId) {
    return `${formatSubCollectionKey(
      request,
      params.colId,
      params.subColId
    )}:card:${params.cardId}`;
  } else {
    return `${formatCollectionKey(request, params.colId)}:card:${
      params.cardId
    }`;
  }
};

export const createFlashcard = async (request: ApiRequest) => {
  const body = (await request.json()) as FlashcardMetadata;
  if (!body.title) {
    return new Response(JSON.stringify({ error: "Missing flashcard title" }), {
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

  const newData: FlashcardObject = {
    id,
    title: body.title,
    layers: [],
  };

  (request.params as { [k: string]: string }).cardId = id;

  await Flashcards.put(
    formatFlashcardKey(request),
    JSON.stringify(newData.layers),
    {
      metadata: { title: newData.title },
    }
  );

  return new Response(JSON.stringify(newData));
};

export const getFlashcardPreview = async (request: ApiRequest) => {
  const flashcard = await Flashcards.getWithMetadata<FlashcardMetadata>(
    formatFlashcardKey(request),
    "stream"
  );

  if (!flashcard.metadata) {
    return new Response(JSON.stringify({ error: "Flashcard does not exist" }), {
      status: 404,
    });
  }

  const title = flashcard.metadata.title;

  const res: FlashcardPreview = {
    id: (request.params as { [k: string]: string }).cardId,
    title,
  };

  return new Response(JSON.stringify(res));
};

export const getFlashcardLayers = async (request: ApiRequest) => {
  const flashcard = await Flashcards.get(formatFlashcardKey(request), "stream");

  if (!flashcard) {
    return new Response(JSON.stringify({ error: "Flashcard does not exist" }), {
      status: 404,
    });
  }

  return new Response(flashcard);
};

export const updateFlashcardTitle = async (request: ApiRequest) => {
  const body = (await request.json()) as FlashcardMetadata;
  if (!body.title) {
    return new Response(JSON.stringify({ error: "Missing flashcard title" }), {
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

  const flashcard = await Flashcards.getWithMetadata<FlashcardMetadata>(
    formatFlashcardKey(request),
    "stream"
  );

  if (!flashcard.metadata) {
    return new Response(JSON.stringify({ error: "Flashcard does not exist" }), {
      status: 404,
    });
  }

  const cardTitle = flashcard.metadata.title;

  const res: FlashcardPreview = {
    id: (request.params as { [k: string]: string }).cardId,
    title: body.title,
  };

  if (res.title !== cardTitle) {
    await Flashcards.put(formatFlashcardKey(request), flashcard.value!, {
      metadata: { title: res.title },
    });
  }

  return new Response(JSON.stringify(res));
};

export const updateFlashcardLayers = async (request: ApiRequest) => {
  if (!request.body) {
    return new Response(
      JSON.stringify({ error: "Expected a string of layers" })
    );
  }

  const flashcard = await Flashcards.getWithMetadata(
    formatFlashcardKey(request),
    "stream"
  );

  if (!flashcard.metadata) {
    return new Response(JSON.stringify({ error: "Flashcard does not exist" }), {
      status: 404,
    });
  }

  await Flashcards.put(formatFlashcardKey(request), request.body, {
    metadata: flashcard.metadata,
  });

  return new Response(JSON.stringify({ success: true }));
};

export const deleteFlashcard = async (request: ApiRequest) => {
  await Flashcards.delete(formatFlashcardKey(request));

  return new Response(JSON.stringify({ success: true }));
};
