import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import useSWR from "swr";
import Button from "../components/Button";
import PrintFlashcard from "../components/PrintFlashcard";
import { getAllFlashcardsResponse } from "../interfaces";
import { useSelf } from "../utils/auth";
import { ApiError, bodyApiFetch, FetchError } from "../utils/fetch";

const PrintCollectionPage = () => {
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

  const { data, error } = useSWR<getAllFlashcardsResponse | false, FetchError>(
    `/collections/${collectionId}/subcollections/${subCollectionId}`,
    bodyApiFetch,
    {
      focusThrottleInterval: 1000 * 60 * 15, // limit to one every 15 minutes
      errorRetryInterval: 1000 * 60 * 15, // limit to one every 15 minutes
    }
  );

  const [colError, setColError] = useState(<></>);
  useEffect(() => {
    const errInfo = error ? (error.info as ApiError) : undefined;
    const err = errInfo ? errInfo.error : undefined;
    if (err) {
      setColError(<>{err}</>);
    } else {
      // might occur if an unknown type of response occurs e.g. server down
      if (errInfo !== undefined) setColError(<>Oops, something went wrong.</>);
    }
  }, [error]);

  return (
    (self && data && (
      <div>
        <Head>
          <title>Flashcard Web App</title>
          <meta name="Description" content="A Flashcard Web App" />
        </Head>
        <div className="text-nord11">{colError}</div>
        <Button
          type="button"
          color="primary"
          size="small"
          className="mx-auto noPrint"
          buttonType="button"
          onClick={() => window.print()}
        >
          Print
        </Button>
        <div>
          {data.flashcardData.map((flashcardPreview) => {
            return (
              <PrintFlashcard
                key={flashcardPreview.id}
                colId={collectionId}
                cardId={flashcardPreview.id}
                isSub={true}
                subId={subCollectionId}
                isMultiPrint={true}
              />
            );
          })}
        </div>
      </div>
    )) ||
    null
  );
};

export default PrintCollectionPage;
