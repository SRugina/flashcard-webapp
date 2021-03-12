import Flashcard from "../components/Flashcard";
import { useGlobal } from "../providers/GlobalProvider";

const Editor = () => {
  const {
    activeLayer,
    setActiveLayer,
    layers,
    addNewLayer,
    deleteCurrentLayer,
    deleteCurrentItem,
    addTextItem,
    addImageItem,
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
    <div className="flex mx-auto justify-center">
      <div className="">
        <Flashcard layers={layers} />
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
        <button
          type="button"
          className="mt-1 font-semibold py-1 px-2 text-nord6 rounded bg-nord9 hover:bg-nord10 focus:bg-nord10"
          onClick={() => setActiveLayer(-1)}
        >
          Preview Output
        </button>
      </div>
      <div className="ml-4 flex flex-col" style={{ maxWidth: "15ch" }}>
        <button
          type="button"
          className="mt-1 font-semibold py-1 px-2 text-nord11 rounded border-2 border-nord11 hover:bg-nord11 hover:text-nord6 focus:bg-nord11 focus:text-nord6"
          onClick={() => deleteCurrentLayer()}
        >
          Delete Layer
        </button>
        <button
          type="button"
          className="mt-1 font-semibold py-1 px-2 text-nord11 rounded border-2 border-nord11 hover:bg-nord11 hover:text-nord6 focus:bg-nord11 focus:text-nord6"
          onClick={() => deleteCurrentItem()}
        >
          Delete Item
        </button>
        <button
          type="button"
          className="mt-1 font-semibold py-1 px-2 text-nord6 rounded bg-nord9 hover:bg-nord10 focus:bg-nord10"
          onClick={() => addTextItem()}
        >
          Add Text
        </button>
        <button
          type="button"
          className="mt-1 font-semibold py-1 px-2 text-nord6 rounded bg-nord9 hover:bg-nord10 focus:bg-nord10"
          onClick={() => addImageItem()}
        >
          Add Image
        </button>
        <button
          type="button"
          className="mt-1 font-semibold py-1 px-2 text-nord6 rounded bg-nord9 hover:bg-nord10 focus:bg-nord10"
          onClick={() => {
            setIsDrawingMode(!isDrawingMode);
          }}
        >
          {!isDrawingMode ? "Enter" : "Leave"} Drawing Mode
        </button>
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
  );
};

export default Editor;
