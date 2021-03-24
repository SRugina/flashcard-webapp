import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Flashcard from "../components/Flashcard";
import { useSelf } from "../utils/auth";
import { useFlashcard, useFlashcardPreview } from "../utils/flashcards";

const PrintCollectionFlashcardIdPage = () => {
  const { self, protectRoute } = useSelf();

  protectRoute();

  const router = useRouter();
  const [collectionId, setCollectionId] = useState("");
  const [subCollectionId, setSubCollectionId] = useState("");
  const [flashcardId, setFlashcardId] = useState("");
  useEffect(() => {
    if (router.query.collectionId)
      setCollectionId(router.query.collectionId as string);
    if (router.query.subCollectionId)
      setSubCollectionId(router.query.subCollectionId as string);
    if (router.query.flashcardId)
      setFlashcardId(router.query.flashcardId as string);
  }, [router.query]);

  const { previewData, titleError } = useFlashcardPreview(
    collectionId,
    flashcardId,
    true,
    subCollectionId
  );

  const [error, setError] = useState(<>{titleError}</>);

  useEffect(() => {
    setError(<>{titleError}</>);
  }, [titleError]);

  const [title, setTitle] = useState("");

  useEffect(() => {
    if (previewData) {
      if (previewData.title) setTitle(previewData.title);
    }
  }, [previewData]);

  const [dataError, setDataError] = useState(<>{titleError}</>);

  const { layers, layerError } = useFlashcard(
    collectionId,
    flashcardId,
    true,
    subCollectionId
  );

  useEffect(() => {
    setDataError(<>{layerError}</>);
  }, [layerError]);

  return (
    (self && previewData && layers && (
      <div>
        <Head>
          <title>Flashcard Web App</title>
          <meta name="Description" content="A Flashcard Web App" />
        </Head>
        <div className="text-nord11 text-center">
          {error} {dataError}
        </div>
        <div className="flex mx-auto justify-evenly">
          <div
            className="relative overflow-hidden line-clamp-4 rounded-lg bg-gray-300 text-2xl font-bold text-gray-400"
            style={{ width: "152mm", height: "102mm" }}
          >
            <h1>{title}</h1>
          </div>
          <Flashcard layers={layers} printMode={true} />
        </div>
      </div>
    )) ||
    null
  );
};

export default PrintCollectionFlashcardIdPage;
