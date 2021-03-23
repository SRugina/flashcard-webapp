import Head from "next/head";
import { FormEvent, useEffect, useState } from "react";
import Button from "../components/Button";
import Input from "../components/Input";
import { CollectionMetadata } from "../interfaces";
import { useSelf } from "../utils/auth";
import { useCollections } from "../utils/collections";

const CollectionsPage = () => {
  const { self, protectRoute } = useSelf();
  const { collections, colError, createCollection } = useCollections();

  protectRoute();

  useEffect(() => {
    setGenericError(<>{colError}</>);
  }, [colError]);

  const [genericError, setGenericError] = useState(<>{colError}</>);
  const [title, setTitle] = useState("");

  const newCollection = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const newCollectionData: CollectionMetadata = {
        title,
      };
      await createCollection(newCollectionData);
      return;
    } catch (err) {
      setGenericError(<>{err}</>);
    }
  };

  return (
    (self && collections && (
      <div>
        <Head>
          <title>Flashcard Web App</title>
          <meta name="Description" content="A Flashcard Web App" />
        </Head>
        <div className="my-4 flex mx-auto justify-evenly">
          <section className="container max-w-xs sm:max-w-xl lg:max-w-2xl bg-gray-100 shadow-md mx-auto sm:m-0 p-6 rounded-lg">
            <h1 className="text-2xl text-center font-bold">Your Collections</h1>
            <div className="text-nord11 text-center">{genericError}</div>
            <form className="mb-1 mt-2" onSubmit={newCollection}>
              <div className="flex items-center justify-between">
                New:
                <Input
                  type="text"
                  id="title"
                  noLabel={true}
                  value={title}
                  placeholder="Title"
                  onChange={(e) => setTitle(e.target.value)}
                  extraInputClass="ml-2"
                  required
                />
                <Button
                  type="button"
                  buttonType="submit"
                  color="primary"
                  size="medium"
                  className="ml-4"
                >
                  Add
                </Button>
              </div>
            </form>

            <div className="flex flex-col sm:flex-row sm:flex-wrap overflow-hidden mx-auto">
              {collections.map((collection) => {
                return (
                  <Button
                    key={collection.id}
                    type="link"
                    color="custom"
                    size="custom"
                    href={`/collections/${collection.id}`}
                    className="h-64 w-64 max-w-full rounded overflow-hidden line-clamp-5 mt-1 p-2 mx-auto bg-gray-300 text-3xl font-bold text-gray-400"
                  >
                    <p className="overflow-ellipsis overflow-hidden break-words leading-tight">
                      {collection.title}
                    </p>
                  </Button>
                );
              })}
            </div>
          </section>
        </div>
      </div>
    )) ||
    null
  );
};

export default CollectionsPage;
