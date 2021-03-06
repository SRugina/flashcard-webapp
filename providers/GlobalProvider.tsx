import {
  createContext,
  useContext,
  useState,
  useMemo,
  ReactNode,
  Dispatch,
} from "react";
import { LayerData } from "../components/Layer";

export type GlobalData = {
  activeLayer: number;
  setActiveLayer: Dispatch<number>;
  layers: Array<LayerData>;
  addNewLayer: () => void;
  deleteCurrentLayer: () => void;
  updateItem: (itemId: number, layerId: number, data: updateItemData) => void;
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
          left: 0,
          right: 0,
          width: 100,
          height: 100,
          contents: "Hello There!",
        },
      ],
    },
    {
      id: 1,
      contents: [
        {
          id: 0,
          type: "text",
          left: 0,
          right: 0,
          width: 100,
          height: 100,
          contents: "Hi!",
        },
      ],
    },
  ] as Array<LayerData>);
  const [activeLayer, setActiveLayer] = useState(0);

  const addNewLayer = () => {
    setLayers([
      ...layers,
      { id: layers[layers.length - 1].id + 1, contents: [] },
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

  const values = useMemo(
    () => ({
      activeLayer,
      setActiveLayer,
      layers,
      addNewLayer,
      deleteCurrentLayer,
      updateItem,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [activeLayer, layers]
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
