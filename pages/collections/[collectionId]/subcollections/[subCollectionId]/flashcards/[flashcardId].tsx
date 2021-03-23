import Head from "next/head";
import { useRouter } from "next/router";
import { FormEvent, useEffect, useState } from "react";
import Button from "../../../../../../components/Button";
import Editor from "../../../../../../components/Editor";
import Input from "../../../../../../components/Input";
import { FlashcardMetadata } from "../../../../../../interfaces";
import { useSelf } from "../../../../../../utils/auth";
import { useFlashcardPreview } from "../../../../../../utils/flashcards";

const SubCollectionFlashcardIdPage = () => {
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

  const { previewData, titleError, updateTitle } = useFlashcardPreview(
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
  const [formTitle, setFormTitle] = useState("");

  useEffect(() => {
    if (previewData) {
      if (previewData.title) setTitle(previewData.title);
    }
  }, [previewData]);

  const changeTitle = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const updateTitleData: FlashcardMetadata = {
        title,
      };
      await updateTitle(updateTitleData);
      return;
    } catch (err) {
      setError(<>{err}</>);
    }
  };

  return (
    (self && previewData && (
      <div>
        <Head>
          <title>Flashcard Web App</title>
          <meta name="Description" content="A Flashcard Web App" />
        </Head>
        <div className="flex mx-auto justify-evenly">
          <h1
            className="text-2xl font-bold overflow-x-auto whitespace-nowrap"
            style={{ maxWidth: "60ch" }}
          >
            {title}
          </h1>
          <div className="ml-2 text-nord11 self-center">{error}</div>
          <form onSubmit={changeTitle}>
            <div className="flex items-center justify-start">
              <Input
                type="text"
                id="title"
                noLabel={true}
                value={formTitle}
                placeholder={title}
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
                className="ml-4 whitespace-nowrap"
              >
                Change title
              </Button>
            </div>
          </form>
        </div>
        <div className="mx-auto w-full">
          <Editor
            colId={collectionId}
            cardId={flashcardId}
            isSub={true}
            subId={subCollectionId}
          />
        </div>
      </div>
    )) ||
    null
  );
};

export default SubCollectionFlashcardIdPage;
