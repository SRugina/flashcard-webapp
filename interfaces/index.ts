export interface CollectionMetadata {
  title: string;
}

export interface CollectionPreview extends CollectionMetadata {
  id: string;
}

export interface getCollectionResponse extends CollectionPreview {
  subCollectionData: Array<SubCollectionPreview>;
  flashcardData: Array<FlashcardPreview>;
}

export interface getAllFlashcardsResponse extends CollectionPreview {
  flashcardData: Array<FlashcardPreview>;
}

export interface SubCollectionMetadata {
  title: string;
}

export interface SubCollectionPreview extends SubCollectionMetadata {
  id: string;
}

export interface getSubCollectionResponse extends SubCollectionPreview {
  flashcardData: Array<FlashcardPreview>;
}

export interface FlashcardMetadata {
  title: string;
}

export interface FlashcardPreview extends FlashcardMetadata {
  id: string;
}

export interface FlashcardData {
  layers: Array<LayerData>;
}

export type FlashcardObject = FlashcardPreview & FlashcardData;
export type UpdateFlashcardObject = FlashcardMetadata & FlashcardData;

export type LayerData = {
  id: number;
  contents: Array<CardItemData>;
  drawContents: string;
};

export type CardItemData = {
  id: number;
  type: "text" | "image";
  left: number;
  top: number;
  width: number;
  height: number;
  contents: any;
};

export type updateItemData = {
  left: number;
  top: number;
  width: number;
  height: number;
  contents: any;
};

export type UserMetadata = {
  id: string;
  password: string;
};

export type Self = {
  id: string;
  username: string;
};

export type NewUserData = {
  username: string;
  password: string;
};

export type UpdateUserData = {
  username: string;
};

export type UpdateUserPasswordData = {
  oldPassword: string;
  password: string;
};
