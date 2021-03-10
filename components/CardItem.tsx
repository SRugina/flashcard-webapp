import { SyntheticEvent, useEffect, useRef, useState } from "react";
import Draggable, { DraggableData, DraggableEvent } from "react-draggable";
import { Resizable, ResizeCallbackData } from "react-resizable";
import { useGlobal } from "../providers/GlobalProvider";
import CardImage from "./CardImage";
import CardText from "./CardText";

export type CardItemData = {
  id: number;
  type: "text" | "image";
  left: number;
  top: number;
  width: number;
  height: number;
  contents: any;
};

export interface CardItemProps extends CardItemData {
  parent: HTMLElement | null;
  parentId: number;
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
}: CardItemProps) => {
  const [deltaPosition, setDeltaPosition] = useState({ x: left, y: top });
  const [size, setSize] = useState({ width, height });
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const [content, setContent] = useState(contents);
  const nodeRef = useRef(null);

  const { updateItem, setActiveItem } = useGlobal();

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
    updateItem(id, parentId, {
      left: deltaPosition.x,
      top: deltaPosition.y,
      width: size.width,
      height: size.height,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      contents: content,
    });
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
      >
        <Resizable
          width={size.width}
          height={size.height}
          onResize={handleResize}
          maxConstraints={[
            parent.clientWidth - deltaPosition.x,
            parent.clientHeight - deltaPosition.y,
          ]}
        >
          <div
            onFocus={() => setActiveItem(id)}
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
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              <CardText content={content} setContent={setContent} />
            ) : type === "image" ? (
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              <CardImage content={content} setContent={setContent} />
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
