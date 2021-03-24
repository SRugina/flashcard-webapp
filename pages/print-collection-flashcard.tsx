import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import PrintFlashcard from "../components/PrintFlashcard";
import { useSelf } from "../utils/auth";

const PrintCollectionFlashcardIdPage = () => {
  const { self, protectRoute } = useSelf();

  protectRoute();

  const router = useRouter();
  const [collectionId, setCollectionId] = useState("");
  const [flashcardId, setFlashcardId] = useState("");
  useEffect(() => {
    if (router.query.collectionId)
      setCollectionId(router.query.collectionId as string);
    if (router.query.flashcardId)
      setFlashcardId(router.query.flashcardId as string);
  }, [router.query]);

  return (
    (self && (
      <div>
        <Head>
          <title>Flashcard Web App</title>
          <meta name="Description" content="A Flashcard Web App" />
        </Head>
        <PrintFlashcard colId={collectionId} cardId={flashcardId} />
      </div>
    )) ||
    null
  );
};

export default PrintCollectionFlashcardIdPage;
