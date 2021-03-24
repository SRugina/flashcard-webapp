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

  return (
    (self && (
      <div>
        <Head>
          <title>Flashcard Web App</title>
          <meta name="Description" content="A Flashcard Web App" />
        </Head>
        <PrintFlashcard
          shouldPrint={shouldPrint}
          colId={collectionId}
          cardId={flashcardId}
          isSub={true}
          subId={subCollectionId}
        />
      </div>
    )) ||
    null
  );
};

export default PrintCollectionFlashcardIdPage;
