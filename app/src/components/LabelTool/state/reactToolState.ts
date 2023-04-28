import create from "zustand";
import { devtools } from "zustand/middleware";
import { ImageLocation, NotesInterface } from "../../../types/collectedImage";

export interface ReactToolBoxAttributes {
  x: number;
  y: number;
  width: number;
  height: number;
  fill: string;
  id: string;
  stroke: string | CanvasGradient | undefined;
  strokeWidth: number;
  isVisible: boolean;
  type: string;
  subtype: string | undefined;
  labeledBy: string;
  notes?: NotesInterface;
}

export interface ReactToolImageListItemType {
  imageId: string;
  imgSrc: string;
  fileName: string;
  location: ImageLocation;
  labels: ReactToolBoxAttributes[];
}

export interface TypeConfig {
  type: string;
  color: string;
  subtype: string[] | undefined;
}

export interface OperationFunctions {
  onDeleteImage?: (image: ReactToolImageListItemType) => void;
  onSubmitImage?: (image: ReactToolImageListItemType) => void;
  onSuccessExit?: () => void;
  onFailureExit?: () => void;
}

export interface ReactToolState {
  /* ---------------------- Disable Delete Image Function --------------------- */
  disableDelete: boolean;
  initDisableDelete: (update: boolean) => void;

  /* ------------------------------ Image Source ------------------------------ */
  reactToolImageList: ReactToolImageListItemType[];
  // Change specific label inside specific image
  changeReactToolImageLabels: (
    boxId: string,
    updateAttrs: Partial<ReactToolBoxAttributes>
  ) => void;
  deleteReactToolImageLabel: (boxId: string) => void;
  addReactToolImageLabel: (
    imageId: string,
    newLabel: ReactToolBoxAttributes
  ) => void;

  /* ------------------------------ Handle Submit ----------------------------- */
  isSubmitting: boolean;
  updateIsSubmitting: (update: boolean) => void;

  // Init image list when react tool is mounted
  initReactToolState: (imageList: ReactToolImageListItemType[]) => void;
  // Delete Image
  deleteReactToolImage: (imageId: string) => void;

  /* ------------------------------ Current Image ----------------------------- */
  selectedImageId: string;
  changeSelectedImageId: (imageId: string) => void;

  /* -------------------------- Save Type Config Info ------------------------- */
  typeConfigs: TypeConfig[];
  initTypeConfigs: (typeConfigs: TypeConfig[]) => void;

  /* -------------------------------- get notes ------------------------------- */
  currentNotes: NotesInterface;
  updateCurrentNotes: (boxId:string, notes:NotesInterface) => void;

  // Global operation functions
  operationsFuncs: OperationFunctions;
  initOperationFunctions: (funcs: OperationFunctions) => void;
}

export const useReactToolsStore = create<ReactToolState>(
  devtools(
    (set) => ({
      disableDelete: false,
      initDisableDelete: (update) => {
        set(
          (state) => ({ ...state, disableDelete: update }),
          false,
          "ReactToolState/initDisableDelete"
        );
      },
      reactToolImageList: [],
      changeReactToolImageLabels: (boxId, updateAttrs) => {
        set(
          (state) => {
            const newImageList = JSON.parse(
              JSON.stringify(
                state.reactToolImageList.map((image) => {
                  image.labels = image.labels.map((label) => {
                    let result = label;
                    if (label.id === boxId) {
                      result = { ...label, ...updateAttrs };
                    }
                    return result;
                  });
                  return image;
                })
              )
            );
            return {
              ...state,
              reactToolImageList: newImageList,
            };
          },
          false,
          "ReactToolState/changeReactToolImageLabels"
        );
      },
      currentNotes:{
        name:'',
        address:'',
        handicap: '',
        accessible: ''
      },
      updateCurrentNotes:(boxId,notes) => {
        set(
          (state) => {
            state.changeReactToolImageLabels(boxId,{notes:notes})
            return{...state,currentNotes: notes}
          },
          false,
          "ReactToolState/updateCurrentNotes"
        );
      },

      deleteReactToolImageLabel: (boxId) => {
        set(
          (state) => {
            const newImageList = JSON.parse(
              JSON.stringify(
                state.reactToolImageList.map((image) => {
                  image.labels = image.labels.filter(
                    (item) => item.id !== boxId
                  );
                  return image;
                })
              )
            );
            return {
              ...state,
              reactToolImageList: newImageList,
            };
          },
          false,
          "ReactToolState/deleteReactToolImage"
        );
      },
      addReactToolImageLabel: (imageId, newLabel) => {
        set(
          (state) => ({
            ...state,
            reactToolImageList: state.reactToolImageList.map((image) => {
              if (image.imageId === imageId) {
                image.labels = [...image.labels, newLabel];
              }
              return image;
            }),
          }),
          false,
          "ReactToolState/addReactToolImageLabel"
        );
      },

      selectedImageId: "",
      initReactToolState: (imageList) => {
        set(
          (state) => {
            if (imageList.length === 0) {
              return { ...state, reactToolImageList: imageList };
            }
            return {
              ...state,
              reactToolImageList: imageList,
              selectedImageId: imageList[0].imageId,
            };
          },
          false,
          "ReactToolState/initReactToolState"
        );
      },
      changeSelectedImageId: (imageId) => {
        set(
          (state) => ({ ...state, selectedImageId: imageId }),
          false,
          "ReactToolState/changeSelectedImageId"
        );
      },
      deleteReactToolImage: (imageId) => {
        set(
          (state) => {
            const filterList = state.reactToolImageList.filter(
              (item) => item.imageId !== imageId
            );
            const selectedImg =
              filterList.length > 0 ? filterList[0].imageId : "";
            return {
              ...state,
              selectedImageId: selectedImg,
              reactToolImageList: filterList,
            };
          },
          false,
          "ReactToolState/deleteReactToolImage"
        );
      },

      typeConfigs: [],
      initTypeConfigs: (typeConfigs) => {
        set(
          (state) => ({ ...state, typeConfigs }),
          false,
          "ReactToolState/initTypeConfigs"
        );
      },

      operationsFuncs: {},
      initOperationFunctions: (funcs) => {
        set(
          (state) => ({ ...state, operationsFuncs: funcs }),
          false,
          "ReactToolState/initOperationFunctions"
        );
      },

      /* ------------------------------ Handle Submit ----------------------------- */
      isSubmitting: false,
      updateIsSubmitting: (update) => {
        set(
          (state) => ({ ...state, isSubmitting: update }),
          false,
          "ReactToolState/updateIsSubmitting"
        );
      },
    }),
    { name: "ReactToolState" }
  )
);
