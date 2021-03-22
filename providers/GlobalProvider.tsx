import { decompress } from "lz-string";
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
import { toast } from "react-toastify";
import {
  CardItemData,
  CollectionPreview,
  FlashcardObject,
  FlashcardPreview,
  getCollectionResponse,
  getSubCollectionResponse,
  LayerData,
  SubCollectionPreview,
} from "../interfaces";
import { FetchError, bodyApiFetch as fetch } from "../utils/fetch";

export type GlobalData = {
  /**
   * the user's root collections, from the Collections Namespace
   */
  collections: Array<CollectionPreview>;
  currentCollection: getCollectionResponse | null;
  loadCollections: () => Promise<void>;
  getCurrentCollection: (id: string) => Promise<getCollectionResponse | null>;

  /**
   * the current subCollections that were fetched.
   */
  subCollections: Array<SubCollectionPreview>;
  currentSubCollection: getSubCollectionResponse | null;
  loadSubCollections: () => Promise<void>;
  getCurrentSubCollection: (
    id: string
  ) => Promise<getSubCollectionResponse | null>;

  /**
   * the current flashcards that were fetched.
   */
  flashcards: Array<FlashcardPreview>;
  currentFlashcard: FlashcardObject | null;
  loadFlashcards: () => Promise<void>;
  getCurrentFlashcard: (id: string) => Promise<FlashcardObject | null>;

  /**
   * the currently open flashcard's layers.
   */
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
  createToast: (message: string) => void;
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
  const [collections, setCollections] = useState(
    [] as Array<CollectionPreview>
  );
  const [currentCollection, setCurrentCollection] = useState(
    null as getCollectionResponse | null
  );

  const loadCollections = async () => {
    try {
      const data = await fetch<Array<CollectionPreview>>("/collections", "GET");
      setCollections(data || []);
      return;
    } catch (err) {
      const error = err as FetchError;
      // No specific errors expected, if occurs then we don't know the
      // format, so throw info as-is
      throw error.info;
    }
  };
  const getCurrentCollection = async (id: string) => {
    try {
      const data = await fetch<getCollectionResponse>(
        `/collections/${id}`,
        "GET"
      );
      setCurrentCollection(data || null);
      return data || null;
    } catch (err) {
      const error = err as FetchError;
      // No specific errors expected, if occurs then we don't know the
      // format, so throw info as-is
      throw error.info;
    }
  };

  const [subCollections, setSubCollections] = useState(
    [] as Array<SubCollectionPreview>
  );
  const [currentSubCollection, setCurrentSubCollection] = useState(
    null as getSubCollectionResponse | null
  );

  const loadSubCollections = async () => {
    try {
      const data = await fetch<Array<SubCollectionPreview>>(
        `/collections/${currentCollection?.id || ""}/subcollections`,
        "GET"
      );
      setSubCollections(data || []);
      return;
    } catch (err) {
      const error = err as FetchError;
      // No specific errors expected, if occurs then we don't know the
      // format, so throw info as-is
      throw error.info;
    }
  };
  const getCurrentSubCollection = async (id: string) => {
    try {
      const data = await fetch<getSubCollectionResponse>(
        `/collections/${currentCollection?.id || ""}/subcollections/${id}`,
        "GET"
      );
      setCurrentSubCollection(data || null);
      return data || null;
    } catch (err) {
      const error = err as FetchError;
      // No specific errors expected, if occurs then we don't know the
      // format, so throw info as-is
      throw error.info;
    }
  };

  const [flashcards, setFlashcards] = useState([] as Array<FlashcardPreview>);
  const [currentFlashcard, setCurrentFlashcard] = useState(
    null as FlashcardObject | null
  );

  const loadFlashcards = async () => {
    try {
      const key = `/collections/${currentCollection?.id || ""}${
        currentSubCollection
          ? `/subcollections/${currentSubCollection?.id}/flashcards`
          : `/flashcards`
      }`;
      const data = await fetch<Array<FlashcardPreview>>(key, "GET");
      setFlashcards(data || []);
      return;
    } catch (err) {
      const error = err as FetchError;
      // No specific errors expected, if occurs then we don't know the
      // format, so throw info as-is
      throw error.info;
    }
  };
  const getCurrentFlashcard = async (id: string) => {
    try {
      const key = `/collections/${currentCollection?.id || ""}${
        currentSubCollection
          ? `/subcollections/${currentSubCollection?.id}/flashcards/${id}`
          : `/flashcards/${id}`
      }`;

      const metadata = (await fetch<FlashcardPreview>(
        `${key}/metadata`,
        "GET"
      )) || { id: "", title: "" };
      const rawLayers = await fetch<string>(`${key}/layers`, "GET");

      const layers = JSON.parse(
        decompress(rawLayers || "") || "[]"
      ) as Array<LayerData>;

      const data: FlashcardObject | null = { ...metadata, layers } || null;

      setCurrentFlashcard(data);
      return data;
    } catch (err) {
      const error = err as FetchError;
      // No specific errors expected, if occurs then we don't know the
      // format, so throw info as-is
      throw error.info;
    }
  };

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

  const createToast = (message: string) => {
    toast.error(message);
  };

  const values = useMemo(
    () => ({
      collections,
      currentCollection,
      loadCollections,
      getCurrentCollection,
      subCollections,
      currentSubCollection,
      loadSubCollections,
      getCurrentSubCollection,
      flashcards,
      currentFlashcard,
      getCurrentFlashcard,
      loadFlashcards,
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
      createToast,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      collections,
      currentCollection,
      subCollections,
      currentSubCollection,
      flashcards,
      currentFlashcard,
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
