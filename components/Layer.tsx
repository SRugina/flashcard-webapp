import { useState } from "react";
import { useGlobal } from "../providers/GlobalProvider";
import CardItem, { CardItemData } from "./CardItem";

export type LayerData = {
  id: number;
  contents: Array<CardItemData>;
};

export interface LayerProps extends LayerData {
  zIndex: number;
}

const Layer = ({ id, zIndex, contents }: LayerProps) => {
  const { activeLayer } = useGlobal();
  const [parent, setParent] = useState<HTMLDivElement | null>(null);

  return (
    <div
      ref={(parent) => setParent(parent)}
      className="absolute top-0 left-0 w-full h-full"
      style={{ zIndex: activeLayer === id ? 1000 : zIndex }}
    >
      {contents.map((element) => {
        return (
          <CardItem
            key={element.id}
            parent={parent}
            parentId={id}
            {...element}
          ></CardItem>
        );
      })}
    </div>
  );
};

export default Layer;
