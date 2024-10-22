import { useEffect, useMemo, useState } from "react";
import useSWR from "swr";
import {
  CardItemData,
  FlashcardMetadata,
  FlashcardPreview,
  LayerData,
  updateItemData,
} from "../interfaces";
import { useGlobal } from "../providers/GlobalProvider";
import {
  ApiError,
  bodyApiFetch,
  decompressBodyApiFetch,
  FetchError,
} from "./fetch";

export function useFlashcardPreview(
  colId: string,
  cardId: string,
  isSub = false,
  subId?: string
) {
  const {
    data: previewData,
    error: previewError,
    mutate: mutatePreview,
  } = useSWR<FlashcardPreview | false, FetchError>(
    isSub
      ? `/collections/${colId}/subcollections/${subId!}/flashcards/${cardId}/preview`
      : `/collections/${colId}/flashcards/${cardId}/preview`,
    bodyApiFetch,
    {
      focusThrottleInterval: 1000 * 60 * 15, // limit to one every 15 minutes
      errorRetryInterval: 1000 * 60 * 15, // limit to one every 15 minutes
    }
  );

  const refresh = async () => {
    await mutatePreview();
  };

  const [titleError, setTitleError] = useState("");
  useEffect(() => {
    const errInfo = previewError ? (previewError.info as ApiError) : undefined;
    const err = errInfo ? errInfo.error : undefined;
    if (err) {
      setTitleError(err);
    } else {
      // might occur if an unknown type of response occurs e.g. server down
      if (errInfo !== undefined) setTitleError("Oops, something went wrong.");
    }
  }, [previewError]);

  const updateTitle = async (updatedTitle: FlashcardMetadata) => {
    if (previewData) {
      // if data is not false, we can assume the below request will also not be false
      try {
        if (!updatedTitle.title) {
          const err: FetchError = {
            status: 400,
            info: { error: "Missing flashcard title" },
          };
          throw err;
        }
        if (updatedTitle.title.length === 0 || updatedTitle.title.length > 60) {
          const err: FetchError = {
            status: 400,
            info: {
              error: "Title must have length of at least 1 but no more than 60",
            },
          };
          throw err;
        }
        // silent fail if unchanged
        if (updatedTitle.title === previewData.title) return;

        const cardPreview = (await bodyApiFetch<FlashcardPreview>(
          isSub
            ? `/collections/${colId}/subcollections/${subId!}/flashcards/${cardId}/title`
            : `/collections/${colId}/flashcards/${cardId}/title`,
          "PATCH",
          updatedTitle
        )) as FlashcardPreview;
        await mutatePreview(
          {
            ...previewData,
            ...cardPreview,
          },
          false
        );
      } catch (rawErrors) {
        const errInfo = (rawErrors as FetchError).info as ApiError;
        const err = errInfo ? errInfo.error : undefined;
        if (err) {
          throw err;
        } else {
          // might occur if an unknown type of response occurs e.g. server down
          if (errInfo !== undefined) throw "Oops, something went wrong.";
        }
      }
    }
    return;
  };

  const deleteFlashcard = async () => {
    if (previewData) {
      // if data is not false, we can assume the below request will also not be false
      try {
        await bodyApiFetch<FlashcardPreview>(
          isSub
            ? `/collections/${colId}/subcollections/${subId!}/flashcards/${cardId}`
            : `/collections/${colId}/flashcards/${cardId}`,
          "DELETE"
        );
        await mutatePreview(
          {
            id: "DELETED",
            title: "DELETED",
          },
          false
        );
      } catch (rawErrors) {
        const errInfo = (rawErrors as FetchError).info as ApiError;
        const err = errInfo ? errInfo.error : undefined;
        if (err) {
          throw err;
        } else {
          // might occur if an unknown type of response occurs e.g. server down
          if (errInfo !== undefined) throw "Oops, something went wrong.";
        }
      }
    }
    return;
  };

  const values = useMemo(
    () => ({
      previewData,
      titleError,
      loading: previewData === undefined,
      updateTitle,
      deleteFlashcard,
      refresh,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [previewData, titleError]
  );

  return values;
}

export function useFlashcard(
  colId: string,
  cardId: string,
  isSub = false,
  subId?: string
) {
  const { data: layers, error: layerDataError, mutate: mutateLayers } = useSWR<
    Array<LayerData> | false,
    FetchError
  >(
    isSub
      ? `/collections/${colId}/subcollections/${subId!}/flashcards/${cardId}/layers`
      : `/collections/${colId}/flashcards/${cardId}/layers`,
    decompressBodyApiFetch,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      errorRetryInterval: 1000 * 60 * 15, // limit to one every 15 minutes
    }
  );

  const refresh = async () => {
    await mutateLayers();
  };

  const [layerError, setLayerError] = useState("");
  useEffect(() => {
    const errInfo = layerDataError
      ? (layerDataError.info as ApiError)
      : undefined;
    const err = errInfo ? errInfo.error : undefined;
    if (err) {
      setLayerError(err);
    } else {
      // might occur if an unknown type of response occurs e.g. server down
      if (errInfo !== undefined) setLayerError("Oops, something went wrong.");
    }
  }, [layerDataError]);

  const {
    activeLayer,
    activeItem,
    setActiveItem,
    createToast,
    setSaving,
  } = useGlobal();

  const saveLayers = async () => {
    if (layers) {
      if (Array.isArray(layers)) {
        try {
          setSaving(true);
          await decompressBodyApiFetch<Array<LayerData>>(
            isSub
              ? `/collections/${colId}/subcollections/${subId!}/flashcards/${cardId}/layers`
              : `/collections/${colId}/flashcards/${cardId}/layers`,
            "PATCH",
            layers
          );
          createToast("Flashcard Saved", "success");
          setSaving(false);
        } catch (rawErrors) {
          const errInfo = (rawErrors as FetchError).info as ApiError;
          const err = errInfo ? errInfo.error : undefined;
          if (err) {
            setLayerError(err);
          } else {
            // might occur if an unknown type of response occurs e.g. server down
            if (errInfo !== undefined)
              setLayerError("Oops, something went wrong.");
          }
        }
      }
    }
  };

  const addNewLayer = async () => {
    if (layers) {
      await mutateLayers((layers) => {
        if (layers) {
          return [
            ...layers,
            {
              id: layers[layers.length - 1]?.id + 1 || 0,
              contents: [],
              drawContents: "",
            },
          ] as Array<LayerData>;
        } else {
          return layers;
        }
      }, false);
    }
  };

  const deleteCurrentLayer = async () => {
    if (layers) {
      await mutateLayers((layers) => {
        if (layers) {
          return [...layers].filter((layer) => layer.id !== activeLayer);
        } else {
          return layers;
        }
      }, false);
    }
  };

  const updateItem = async (
    itemId: number,
    layerId: number,
    data: updateItemData
  ) => {
    if (layers) {
      await mutateLayers((layers) => {
        if (layers) {
          return [...layers].map((layer) => {
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
          });
        } else {
          return layers;
        }
      }, false);
    }
  };

  const deleteCurrentItem = async () => {
    if (layers) {
      await mutateLayers((layers) => {
        if (layers) {
          return [...layers].map((layer) => {
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
          });
        } else {
          return layers;
        }
      }, false);
      // reset active item as item no longer exists
      setActiveItem(-1);
    }
  };

  const addTextItem = async () => {
    if (layers) {
      await mutateLayers((layers) => {
        if (layers) {
          return [...layers].map((layer) => {
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
                          text:
                            "**bold**, _italic_, ~strike~, `mono`,\n> Quote",
                        },
                      ],
                    },
                  ],
                } as CardItemData,
              ];
              return { ...layer, contents: newContents };
            }
            return layer;
          });
        } else {
          return layers;
        }
      }, false);
    }
  };

  const addImageItem = async () => {
    if (layers) {
      await mutateLayers((layers) => {
        if (layers) {
          return [...layers].map((layer) => {
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
          });
        } else {
          return layers;
        }
      }, false);
    }
  };

  const updateDrawLayer = async (layerId: number, data: string) => {
    if (layers) {
      await mutateLayers((layers) => {
        if (layers) {
          return [...layers].map((layer) => {
            if (layer.id === layerId) {
              return {
                ...layer,
                drawContents: data,
              };
            }
            return layer;
          });
        } else {
          return layers;
        }
      }, false);
    }
  };

  const values = useMemo(
    () => ({
      loading: layers === undefined,
      layers,
      layerError,
      addNewLayer,
      deleteCurrentLayer,
      updateItem,
      deleteCurrentItem,
      addTextItem,
      addImageItem,
      updateDrawLayer,
      saveLayers,
      refresh,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [layers, layerError, activeLayer, activeItem]
  );

  return values;
}
