import create from "zustand";
import { devtools } from "zustand/middleware";

export interface QueryImageType {
  imageId: string;
  imgSrc: string;
  fileName: string;
}

export interface QueryImagesState {
  isUploading: boolean;
  setIsUploading: (value: boolean) => void;
  queryImageList: QueryImageType[];
  addQueryImage: (update: QueryImageType) => void;
  addDBQueryImage: (images: QueryImageType[]) => void;
  deleteQueryImage: (id: string) => void;
}

export const useQueryImagesStore = create<QueryImagesState>(
  devtools(
    (set) => ({
      isUploading: false,
      setIsUploading: (value) => {
        set(
          (state) => ({
            ...state,
            isUploading: value,
          }),
          false,
          "queryImage/setIsUploading"
        );
      },
      queryImageList: [],
      addQueryImage: (update) => {
        set(
          (state) => ({
            ...state,
            queryImageList: [...state.queryImageList, { ...update }],
          }),
          false,
          "queryImage/addQueryImage"
        );
      },
      addDBQueryImage: (images) => {
        set(
          (state) => {
            if (images) {
              return {
                ...state,
                queryImageList: images,
              };
            } else return state;
          },
          false,
          "queryImage/addDBQueryImage"
        );
      },
      deleteQueryImage: (id) => {
        set(
          (state) => ({
            ...state,
            queryImageList: state.queryImageList.filter(
              (image) => image.imageId !== id
            ),
          }),
          false,
          "queryImage/deleteQueryImage"
        );
      },
    }),
    { name: "QueryImagesState" }
  )
);
