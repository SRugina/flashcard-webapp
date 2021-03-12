import {
  createContext,
  useContext,
  useState,
  useMemo,
  ReactNode,
  Dispatch,
  SetStateAction,
  useRef,
  MutableRefObject,
} from "react";
import { CardItemData } from "../components/CardItem";
import { LayerData } from "../components/Layer";

export type GlobalData = {
  layers: Array<LayerData>;
  addNewLayer: () => void;
  activeLayer: number;
  setActiveLayer: Dispatch<SetStateAction<number>>;
  activeItem: number;
  setActiveItem: Dispatch<SetStateAction<number>>;
  isDrawingMode: boolean;
  setIsDrawingMode: Dispatch<SetStateAction<boolean>>;
  deleteCurrentLayer: () => void;
  updateItem: (itemId: number, layerId: number, data: updateItemData) => void;
  deleteCurrentItem: () => void;
  addTextItem: () => void;
  addImageItem: () => void;
  penColour: string;
  penColourRef: MutableRefObject<string>;
  setPenColour: (val: string) => void;
  penRadius: number;
  penRadiusRef: MutableRefObject<number>;
  setPenRadius: (val: number) => void;
  penErase: boolean;
  penEraseRef: MutableRefObject<boolean>;
  setPenErase: (val: boolean) => void;
  updateDrawLayer: (layerId: number, data: string) => void;
};

// Create a context that will hold the values that we are going to expose to our components.
export const GlobalContext = createContext((null as unknown) as GlobalData);

type Props = {
  children: ReactNode;
};

type updateItemData = {
  left: number;
  top: number;
  width: number;
  height: number;
  contents: any;
};

// Create a "controller" component that will calculate all the data that we need
export const GlobalProvider = ({ children }: Props) => {
  const [layers, setLayers] = useState([
    {
      id: 0,
      contents: [
        {
          id: 0,
          type: "text",
          left: 200,
          top: 200,
          width: 200,
          height: 100,
          contents: [
            {
              children: [
                {
                  text: "**bold**, _italic_, ~strike~, `mono`,\n> Quote",
                },
              ],
            },
          ],
        },
      ],
      drawContents: "",
    },
    {
      id: 1,
      contents: [],
      drawContents: "",
    },
  ] as Array<LayerData>);
  const [activeLayer, setActiveLayer] = useState(0);
  const [activeItem, setActiveItem] = useState(-1);
  const [isDrawingMode, setIsDrawingMode] = useState(false);

  const addNewLayer = () => {
    setLayers([
      ...layers,
      {
        id: layers[layers.length - 1]?.id + 1 || 0,
        contents: [],
        drawContents: "",
      },
    ]);
  };

  const deleteCurrentLayer = () => {
    setLayers([...layers].filter((layer) => layer.id !== activeLayer));
  };

  const updateItem = (
    itemId: number,
    layerId: number,
    data: updateItemData
  ) => {
    setLayers(
      [...layers].map((layer) => {
        if (layer.id === layerId) {
          const newContents = layer.contents.map((item) => {
            if (item.id === itemId) {
              return {
                ...item,
                ...data,
              };
            }
            return item;
          });
          return {
            ...layer,
            contents: newContents,
          };
        }
        return layer;
      })
    );
  };

  const deleteCurrentItem = () => {
    setLayers(
      [...layers].map((layer) => {
        if (layer.id === activeLayer) {
          const newContents = layer.contents.filter(
            (item) => item.id !== activeItem
          );
          return {
            ...layer,
            contents: newContents,
          };
        }
        return layer;
      })
    );
    // reset active item as item no longer exists
    setActiveItem(-1);
  };

  const addTextItem = () => {
    setLayers(
      [...layers].map((layer) => {
        if (layer.id === activeLayer) {
          const newContents = [
            ...layer.contents,
            {
              id: layer.contents[layer.contents.length - 1]?.id + 1 || 0,
              type: "text",
              left: 0,
              top: 0,
              width: 200,
              height: 100,
              contents: [
                {
                  children: [
                    {
                      text: "**bold**, _italic_, ~strike~, `mono`,\n> Quote",
                    },
                  ],
                },
              ],
            } as CardItemData,
          ];
          return { ...layer, contents: newContents };
        }
        return layer;
      })
    );
  };

  const addImageItem = () => {
    setLayers(
      [...layers].map((layer) => {
        if (layer.id === activeLayer) {
          const newContents = [
            ...layer.contents,
            {
              id: layer.contents[layer.contents.length - 1]?.id + 1 || 0,
              type: "image",
              left: 0,
              top: 0,
              width: 200,
              height: 200,
              contents: "",
            } as CardItemData,
          ];
          return { ...layer, contents: newContents };
        }
        return layer;
      })
    );
  };

  const [penColour, _setPenColour] = useState("#000000");
  const penColourRef = useRef(penColour);
  const setPenColour = (val: string) => {
    penColourRef.current = val;
    _setPenColour(val);
  };

  const [penRadius, _setPenRadius] = useState(2);
  const penRadiusRef = useRef(penRadius);
  const setPenRadius = (val: number) => {
    penRadiusRef.current = val;
    _setPenRadius(val);
  };

  const [penErase, _setPenErase] = useState(false);
  const penEraseRef = useRef(penErase);
  const setPenErase = (val: boolean) => {
    penEraseRef.current = val;
    _setPenErase(val);
  };

  const updateDrawLayer = (layerId: number, data: string) => {
    setLayers(
      [...layers].map((layer) => {
        if (layer.id === layerId) {
          return {
            ...layer,
            drawContents: data,
          };
        }
        return layer;
      })
    );
  };

  const values = useMemo(
    () => ({
      layers,
      addNewLayer,
      activeLayer,
      setActiveLayer,
      activeItem,
      setActiveItem,
      isDrawingMode,
      setIsDrawingMode,
      deleteCurrentLayer,
      updateItem,
      deleteCurrentItem,
      addTextItem,
      addImageItem,
      penColour,
      penColourRef,
      setPenColour,
      penRadius,
      penRadiusRef,
      setPenRadius,
      penErase,
      penEraseRef,
      setPenErase,
      updateDrawLayer,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      activeLayer,
      layers,
      activeItem,
      isDrawingMode,
      penColour,
      penRadius,
      penErase,
    ]
  );

  // Finally, return the interface that we want to expose to our other components
  return (
    <GlobalContext.Provider value={values}>{children}</GlobalContext.Provider>
  );
};

// We also create a simple custom hook to read these values from.
export const useGlobal = () => {
  const context = useContext(GlobalContext);

  if (context === undefined) {
    throw new Error(
      "`useGlobal` hook must be used within a `GlobalProvider` component"
    );
  }
  return context;
};
