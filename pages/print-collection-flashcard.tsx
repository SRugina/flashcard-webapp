import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useReactToPrint } from "react-to-print";
import Flashcard from "../components/Flashcard";
import { useSelf } from "../utils/auth";
import { useFlashcard, useFlashcardPreview } from "../utils/flashcards";

const PrintCollectionFlashcardIdPage = () => {
  const { self, protectRoute } = useSelf();

  protectRoute();

  const router = useRouter();
  const [collectionId, setCollectionId] = useState("");
  const [flashcardId, setFlashcardId] = useState("");
  const [shouldPrint, setShouldPrint] = useState(false);
  useEffect(() => {
    if (router.query.collectionId)
      setCollectionId(router.query.collectionId as string);
    if (router.query.flashcardId)
      setFlashcardId(router.query.flashcardId as string);
    if (router.query.shouldPrint) setShouldPrint(true);
  }, [router.query]);

  const { previewData, titleError } = useFlashcardPreview(
    router.query.collectionId ? (router.query.collectionId as string) : "",
    router.query.flashcardId ? (router.query.flashcardId as string) : ""
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

  const { layers, layerError } = useFlashcard(collectionId, flashcardId);

  useEffect(() => {
    setDataError(<>{layerError}</>);
  }, [layerError]);

  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  const handlePrint = useReactToPrint({
    content: () => container,
    documentTitle: title,
    copyStyles: true,
  });

  useEffect(() => {
    if (
      shouldPrint &&
      previewData &&
      layers &&
      handlePrint &&
      container !== null
    ) {
      handlePrint();
    }
  }, [shouldPrint, previewData, layers, handlePrint, container]);

  return (
    (self && previewData && layers && (
      <div>
        <Head>
          <title>Flashcard Web App</title>
          <meta name="Description" content="A Flashcard Web App" />
        </Head>
        <div className="text-nord11">
          {error} {dataError}
        </div>
        <div
          className="flex justify-start"
          ref={(element) => setContainer(element)}
        >
          <div
            className="relative overflow-hidden line-clamp-4 rounded-lg bg-gray-300 text-2xl font-bold text-gray-400 flashcardTitleCard"
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
