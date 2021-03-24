import { useState } from "react";
import { LayerData, updateItemData } from "../interfaces";
import { useGlobal } from "../providers/GlobalProvider";
import { useCanvas } from "../utils/canvas";
import CardItem from "./CardItem";

export interface LayerProps extends LayerData {
  zIndex: number;
  updateItem?: (
    itemId: number,
    layerId: number,
    data: updateItemData
  ) => Promise<void>;
  updateDrawLayer?: (layerId: number, data: string) => Promise<void>;
  printMode: boolean;
}

const Layer = ({
  id,
  zIndex,
  contents,
  drawContents,
  updateItem,
  updateDrawLayer,
  printMode,
}: LayerProps) => {
  console.warn(
    "Layer data",
    contents,
    drawContents,
    updateItem,
    updateDrawLayer,
    printMode
  );

  const { activeLayer, isDrawingMode } = useGlobal();
  const [parent, setParent] = useState<HTMLDivElement | null>(null);
  const { setCanvas, error } = useCanvas(drawContents, id, updateDrawLayer);

  return error ? (
    <div>{error}</div>
  ) : (
    <>
      <div
        ref={(parent) => setParent(parent)}
        className="absolute top-0 left-0 w-full h-full"
        style={{
          zIndex: printMode ? zIndex : activeLayer === id ? 1000 : zIndex,
        }}
      >
        {contents.map((element) => {
          return (
            <CardItem
              key={element.id}
              parent={parent}
              parentId={id}
              updateItem={updateItem}
              printMode={printMode}
              {...element}
            ></CardItem>
          );
        })}
      </div>
      <canvas
        ref={(canvas) => setCanvas(canvas)}
        onContextMenu={(e) => e.preventDefault()}
        className="absolute block top-0 left-0 w-full h-full"
        style={{
          touchAction: "none",
          zIndex: printMode
            ? zIndex
            : activeLayer === id
            ? isDrawingMode
              ? 1001
              : 999
            : zIndex,
        }}
      >
        Your browser does not support the canvas element.
      </canvas>
    </>
  );
};

export default Layer;
