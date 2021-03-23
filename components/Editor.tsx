import Flashcard from "../components/Flashcard";
import { useGlobal } from "../providers/GlobalProvider";
import { useFlashcard } from "../utils/flashcards";
import Button from "./Button";

type Props = {
  colId: string;
  cardId: string;
  isSub?: boolean;
  subId?: string;
};

const Editor = ({ colId, cardId, isSub = false, subId }: Props) => {
  const {
    layers,
    addNewLayer,
    deleteCurrentLayer,
    deleteCurrentItem,
    addTextItem,
    addImageItem,
    updateItem,
    updateDrawLayer,
  } = useFlashcard(colId, cardId, isSub, subId);

  const {
    activeLayer,
    setActiveLayer,
    isDrawingMode,
    setIsDrawingMode,
    penColour,
    setPenColour,
    penRadius,
    setPenRadius,
    penErase,
    setPenErase,
  } = useGlobal();
  return (
    (layers && (
      <div className="flex mx-auto justify-center">
        <div className="">
          <Flashcard
            layers={layers}
            updateItem={updateItem}
            updateDrawLayer={updateDrawLayer}
          />
        </div>
        <div className="ml-4 flex flex-col">
          <div
            className="flex flex-col overflow-hidden overflow-y-auto"
            style={{ height: "102mm" }}
          >
            Layers:
            <div
              onClick={() => addNewLayer()}
              className="flex-shrink-0 rounded mt-1 mx-auto w-20 h-20 bg-gray-300 flex justify-center items-center text-4xl font-bold text-gray-400"
            >
              +
            </div>
            {[...layers].reverse().map((layer) => {
              return (
                <div
                  key={layer.id}
                  onClick={() => setActiveLayer(layer.id)}
                  className={`flex-shrink-0 rounded mt-1 mx-auto w-20 h-20 bg-gray-300 flex justify-center items-center text-4xl font-bold text-gray-400 ${
                    activeLayer === layer.id
                      ? "outline-none ring-2 ring-nord9"
                      : ""
                  }`}
                >
                  {layer.id}
                </div>
              );
            })}
          </div>
          <Button
            type="button"
            color="primary"
            size="small"
            className="mt-1"
            buttonType="button"
            onClick={() => setActiveLayer(-1)}
          >
            Preview Output
          </Button>
        </div>
        <div className="ml-4 flex flex-col" style={{ maxWidth: "15ch" }}>
          <Button
            type="button"
            color="danger"
            size="small"
            className="mt-1"
            buttonType="button"
            onClick={() => deleteCurrentLayer()}
          >
            Delete Layer
          </Button>

          <Button
            type="button"
            color="danger"
            size="small"
            className="mt-1"
            buttonType="button"
            onClick={() => deleteCurrentItem()}
          >
            Delete Item
          </Button>
          <Button
            type="button"
            color="primary"
            size="small"
            className="mt-1"
            buttonType="button"
            onClick={() => addTextItem()}
          >
            Add Item
          </Button>
          <Button
            type="button"
            color="primary"
            size="small"
            className="mt-1"
            buttonType="button"
            onClick={() => addImageItem()}
          >
            Add Image
          </Button>

          <Button
            type="button"
            color="primary"
            size="small"
            className="mt-1"
            buttonType="button"
            onClick={() => setIsDrawingMode(!isDrawingMode)}
          >
            {!isDrawingMode ? "Enter" : "Leave"} Drawing Mode
          </Button>

          {isDrawingMode ? (
            <div className="mt-1">
              <label htmlFor="penColour">Pen Colour:</label>
              <input
                type="color"
                id="penColour"
                name="penColour"
                value={penColour}
                onChange={(e) => setPenColour(e.target.value)}
              />
              <label htmlFor="penRadius">Pen Radius: {penRadius}px</label>
              <input
                type="range"
                id="penRadius"
                name="penRadius"
                min="1"
                max="50"
                step="1"
                value={penRadius}
                onChange={(e) => setPenRadius(Number(e.target.value))}
                className="w-full"
              />
              <label htmlFor="penErase">Eraser mode? </label>
              <input
                type="checkbox"
                id="penErase"
                name="penErase"
                checked={penErase}
                onChange={(e) => setPenErase(e.target.checked)}
              />
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>
    )) ||
    null
  );
};

export default Editor;
