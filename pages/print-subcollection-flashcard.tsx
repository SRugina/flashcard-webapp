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
  const [subCollectionId, setSubCollectionId] = useState("");
  const [flashcardId, setFlashcardId] = useState("");
  const [shouldPrint, setShouldPrint] = useState(false);
  useEffect(() => {
    if (router.query.collectionId)
      setCollectionId(router.query.collectionId as string);
    if (router.query.subCollectionId)
      setSubCollectionId(router.query.subCollectionId as string);
    if (router.query.flashcardId)
      setFlashcardId(router.query.flashcardId as string);
    if (router.query.shouldPrint) setShouldPrint(true);
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
            style={{
              width: "152mm",
              height: "102mm",
              backgroundColor: "rgba(209,213,219,1)",
              borderRadius: "0.5rem",
              fontWeight: 700,
              fontSize: "1.5rem",
              lineHeight: "2rem",
              position: "relative",
              color: "rgba(156,163,175,1)",
              overflow: "hidden",
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: 4,
            }}
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
