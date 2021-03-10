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
      <div className="ml-4 flex flex-col">
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
      </div>
    </div>
  );
};

export default Editor;
