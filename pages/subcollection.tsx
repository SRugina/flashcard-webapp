import Head from "next/head";
import { useRouter } from "next/router";
import { FormEvent, useEffect, useState } from "react";
import Button from "../components/Button";
import Input from "../components/Input";
import { CollectionMetadata } from "../interfaces";
import { useSelf } from "../utils/auth";
import { useCurrentCollection } from "../utils/collections";

const SubCollectionIdPage = () => {
  const { self, protectRoute } = useSelf();

  protectRoute();

  const router = useRouter();
  const [collectionId, setCollectionId] = useState("");
  const [subCollectionId, setSubCollectionId] = useState("");
  useEffect(() => {
    if (router.query.collectionId)
      setCollectionId(router.query.collectionId as string);
    if (router.query.subCollectionId)
      setSubCollectionId(router.query.subCollectionId as string);
  }, [router.query]);

  const {
    collection,
    colError,
    updateCollection,
    addFlashcard,
  } = useCurrentCollection(collectionId, true, subCollectionId);

  useEffect(() => {
    setGenericError(<>{colError}</>);
  }, [colError]);

  const [genericError, setGenericError] = useState(<>{colError}</>);
  const [title, setTitle] = useState("");
  const [formTitle, setFormTitle] = useState("");

  useEffect(() => {
    if (collection) {
      if (collection.title) setTitle(collection.title);
    }
  }, [collection]);

  const changeCollection = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const updateCollectionData: CollectionMetadata = {
        title: formTitle,
      };
      await updateCollection(updateCollectionData);
      return;
    } catch (err) {
      setGenericError(<>{err}</>);
    }
  };

  return (
    (self && collection && (
      <div>
        <Head>
          <title>Flashcard Web App</title>
          <meta name="Description" content="A Flashcard Web App" />
        </Head>
        <div className="my-4 flex mx-auto justify-evenly">
          <section className="container max-w-xs sm:max-w-xl lg:max-w-2xl bg-gray-100 shadow-md mx-auto sm:m-0 p-6 rounded-lg">
            <h1
              className="text-2xl font-bold overflow-x-auto whitespace-nowrap"
              style={{ maxWidth: "60ch" }}
            >
              {title}
            </h1>
            <div className="text-nord11 text-center">{genericError}</div>
            <form className="mb-1 mt-2" onSubmit={changeCollection}>
              <div className="flex flex-wrap items-center justify-start">
                <Input
                  type="text"
                  id="title"
                  noLabel={true}
                  value={formTitle}
                  placeholder="Input"
                  onChange={(e) => setFormTitle(e.target.value)}
                  extraInputClass="ml-2 mb-1"
                  minLength={1}
                  maxLength={60}
                  required
                />
                <Button
                  type="button"
                  buttonType="submit"
                  color="primary"
                  size="medium"
                  className="ml-4"
                >
                  Change title
                </Button>
                <Button
                  type="button"
                  buttonType="button"
                  color="primary"
                  size="medium"
                  className="ml-4"
                  onClick={async () => {
                    try {
                      await addFlashcard({ title: formTitle });
                    } catch (err) {
                      setGenericError(<>{err}</>);
                    }
                  }}
                >
                  Add Card
                </Button>
              </div>
            </form>

            <div className="flex flex-col sm:flex-row sm:flex-wrap overflow-hidden mx-auto p-2">
              {collection.flashcardData.map((flashcard) => {
                return (
                  <Button
                    key={flashcard.id}
                    type="link"
                    color="custom"
                    size="custom"
                    href={`/subcollection-flashcard?collectionId=${collectionId}&subCollectionId=${subCollectionId}&flashcardId=${flashcard.id}`}
                    className="h-32 w-48 max-w-full rounded overflow-hidden line-clamp-4 my-1 p-2 mx-auto bg-white shadow-md text-xl font-bold text-gray-400"
                  >
                    <p className="overflow-ellipsis overflow-hidden break-words leading-tight">
                      {flashcard.title}
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

export default SubCollectionIdPage;
