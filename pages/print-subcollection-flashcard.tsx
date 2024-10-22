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
  useEffect(() => {
    if (router.query.collectionId)
      setCollectionId(router.query.collectionId as string);
    if (router.query.subCollectionId)
      setSubCollectionId(router.query.subCollectionId as string);
    if (router.query.flashcardId)
      setFlashcardId(router.query.flashcardId as string);
  }, [router.query]);

  return (
    (self && (
      <div>
        <Head>
          <title>Print Flashcard</title>
          <meta
            name="Description"
            content="The print flashcard page when it belongs to a sub-collection"
          />
        </Head>
        <PrintFlashcard
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
