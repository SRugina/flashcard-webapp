import { FlashcardData, updateItemData } from "../interfaces";
import Layer from "./Layer";

interface Props extends FlashcardData {
  updateItem?: (
    itemId: number,
    layerId: number,
    data: updateItemData
  ) => Promise<void>;
  updateDrawLayer?: (layerId: number, data: string) => Promise<void>;
  printMode?: boolean;
}

const Flashcard = ({
  layers,
  updateItem,
  updateDrawLayer,
  printMode = false,
}: Props) => {
  return (
    <div
      className="relative bg-white rounded-lg"
      style={{ width: "152mm", height: "102mm" }}
    >
      <div
        id="flashcard-background"
        className={
          printMode
            ? ""
            : "absolute top-0 left-0 w-full h-full flex flex-col justify-between rounded-lg overflow-hidden"
        }
        style={
          printMode
            ? {
                zIndex: 0,
                borderRadius: "0.5rem",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                height: "100%",
                overflow: "hidden",
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
              }
            : { zIndex: 0 }
        }
      >
        {
          /* Create 17 lines, equally spaced, for the background of the flashcard */
          Array(17)
            .fill(17)
            .map((_, index) => (
              <div
                key={index}
                className={printMode ? "" : "w-full bg-black"}
                style={
                  printMode
                    ? {
                        height: "0.3mm",
                        backgroundColor: "rgba(0,0,0,1)",
                        width: "100%",
                      }
                    : { height: "0.3mm" }
                }
              ></div>
            ))
        }
      </div>
      {layers.map((layer, index) => {
        return (
          <Layer
            key={layer.id}
            zIndex={index}
            updateItem={updateItem}
            updateDrawLayer={updateDrawLayer}
            printMode={printMode}
            {...layer}
          />
        );
      })}
    </div>
  );
};

export default Flashcard;
