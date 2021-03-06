import { SyntheticEvent, useEffect, useRef, useState } from "react";
import Draggable, { DraggableData, DraggableEvent } from "react-draggable";
import { Resizable, ResizeCallbackData } from "react-resizable";
import { useGlobal } from "../providers/GlobalProvider";
import CardText from "./CardText";

export type CardItemData = {
  id: number;
  type: "text";
  left: number;
  right: number;
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
  right,
  width,
  height,
  type,
  contents,
}: CardItemProps) => {
  const [deltaPosition, setDeltaPosition] = useState({ x: left, y: right });
  const [size, setSize] = useState({ width, height });
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const [content, setContent] = useState(contents);
  const nodeRef = useRef(null);

  const { updateItem } = useGlobal();

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
            className="absolute inline-block rounded hover-handles overflow-hidden"
            style={{ width: size.width, height: size.height }}
            tabIndex={-1}
            ref={nodeRef}
          >
            {type === "text" ? (
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              <CardText content={content} setContent={setContent} />
            ) : (
              <></>
            )}
            <div>
              position x: {deltaPosition.x.toFixed(0)}, y:{" "}
              {deltaPosition.y.toFixed(0)}
            </div>
          </div>
        </Resizable>
      </Draggable>
    )) ||
    null
  );
};

export default CardItem;
