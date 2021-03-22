import Head from "next/head";
import { useEffect } from "react";
import { useGlobal } from "../providers/GlobalProvider";
import { useSelf } from "../utils/auth";

const CollectionsPage = () => {
  const { self, protectRoute } = useSelf();
  const { loadCollections, collections } = useGlobal();

  protectRoute();

  useEffect(() => void loadCollections(), [loadCollections]);

  return (
    (self && (
      <div>
        <Head>
          <title>Flashcard Web App</title>
          <meta name="Description" content="A Flashcard Web App" />
        </Head>
        <div className="mx-auto w-full">{JSON.stringify(collections)}</div>
      </div>
    )) ||
    null
  );
};

export default CollectionsPage;
