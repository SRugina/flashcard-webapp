import { useEffect, useState } from "react";
import { useFlashcard, useFlashcardPreview } from "../utils/flashcards";
import Flashcard from "./Flashcard";

type Props = {
  shouldPrint: boolean;
  colId: string;
  cardId: string;
  isSub?: boolean;
  subId?: string;
  isMultiPrint?: boolean;
};

const PrintFlashcard = ({
  shouldPrint,
  colId,
  cardId,
  isSub = false,
  subId,
  isMultiPrint = false,
}: Props) => {
  const { previewData, titleError } = useFlashcardPreview(
    colId,
    cardId,
    isSub,
    subId
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

  const { layers, layerError } = useFlashcard(colId, cardId, isSub, subId);

  useEffect(() => {
    setDataError(<>{layerError}</>);
  }, [layerError]);

  const [container, setContainer] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    if (
      !isMultiPrint &&
      shouldPrint &&
      previewData &&
      layers &&
      container !== null
    ) {
      window.print();
    }
  }, [isMultiPrint, shouldPrint, previewData, layers, container]);

  return (
    (previewData && layers && (
      <div>
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

export default PrintFlashcard;
