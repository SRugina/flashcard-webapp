import { SyntheticEvent, useEffect, useRef, useState } from "react";
import Draggable, { DraggableData, DraggableEvent } from "react-draggable";
import { Resizable, ResizeCallbackData } from "react-resizable";
import { CardItemData, updateItemData } from "../interfaces";
import { useGlobal } from "../providers/GlobalProvider";
import CardImage from "./CardImage";
import CardText from "./CardText";

export interface CardItemProps extends CardItemData {
  parent: HTMLElement | null;
  parentId: number;
  updateItem?: (
    itemId: number,
    layerId: number,
    data: updateItemData
  ) => Promise<void>;
  printMode: boolean;
}

const CardItem = ({
  id,
  parent,
  parentId,
  left,
  top,
  width,
  height,
  type,
  contents,
  updateItem,
  printMode,
}: CardItemProps) => {
  const [deltaPosition, setDeltaPosition] = useState({ x: left, y: top });
  const [size, setSize] = useState({ width, height });
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const [content, setContent] = useState(contents);
  const nodeRef = useRef(null);

  const { setActiveItem } = useGlobal();

  const handleDrag = (_e: DraggableEvent, data: DraggableData) => {
    const { x, y } = deltaPosition;
    setDeltaPosition({
      x: x + data.deltaX,
      y: y + data.deltaY,
    });
  };

  const handleResize = (_e: SyntheticEvent, data: ResizeCallbackData) => {
    const { width: widthNew, height: heightNew } = data.size;
    setSize({ width: widthNew, height: heightNew });
  };

  useEffect(() => {
    if (!printMode) {
      void updateItem!(id, parentId, {
        left: deltaPosition.x,
        top: deltaPosition.y,
        width: size.width,
        height: size.height,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        contents: content,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deltaPosition, size, content]);

  return (
    (parent !== null && (
      <Draggable
        bounds="parent"
        onDrag={handleDrag}
        cancel={".react-resizable-handle"}
        nodeRef={nodeRef}
        defaultPosition={deltaPosition}
        disabled={printMode}
      >
        <Resizable
          width={size.width}
          height={size.height}
          onResize={handleResize}
          maxConstraints={[
            parent.clientWidth - deltaPosition.x,
            parent.clientHeight - deltaPosition.y,
          ]}
          draggableOpts={{
            disabled: printMode,
          }}
        >
          <div
            onFocus={() => {
              if (printMode) return;
              setActiveItem(id);
            }}
            className={`absolute inline-block rounded hover-handles overflow-hidden ${
              type === "text"
                ? "overflow-y-auto focus-within:outline-none focus-within:ring-2 focus-within:ring-nord9"
                : ""
            }`}
            style={{ width: size.width, height: size.height }}
            tabIndex={-1}
            ref={nodeRef}
          >
            {type === "text" ? (
              <CardText
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                content={content}
                setContent={setContent}
                printMode={printMode}
              />
            ) : type === "image" ? (
              <CardImage
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                content={content}
                setContent={setContent}
                printMode={printMode}
              />
            ) : (
              <></>
            )}
          </div>
        </Resizable>
      </Draggable>
    )) ||
    null
  );
};

export default CardItem;
