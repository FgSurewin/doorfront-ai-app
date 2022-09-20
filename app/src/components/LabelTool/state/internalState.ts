import create from "zustand";
import { devtools } from "zustand/middleware";

/* ------------------- Attributes of Konva Stage Component ------------------ */
export interface StageAttributes {
  x: number;
  y: number;
  scaleX: number;
  scaleY: number;
}
/* ------------------- Attributes of Konva Layer Component ------------------ */
export interface LayerAttributes {
  x: number;
  y: number;
}

/* ------------------- Attributes of Konva Image Component ------------------ */
export interface ImageAttributes {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ScaleConfig {
  minValue: number;
  maxValue: number;
  wheelStep: number;
  buttonStep: number;
}

export type LabelingPoint = { x: number; y: number };

export interface LabelingProcess {
  isLabeling: boolean;
  labelingType: string;
  labelingColor: string;
  startPoint: LabelingPoint | undefined;
  endPoint: LabelingPoint | undefined;
  indicatorLine: LabelingPoint | undefined;
  indicatorLineColor: string;
}

export interface InternalState {
  /* ------------------------------ Handle Stage ------------------------------ */
  stageAttributes: StageAttributes;
  onChangeStageAttributes: (updateAttrs: Partial<StageAttributes>) => void;

  /* ----------------------------- Save Image Info ---------------------------- */
  layerAttributes: LayerAttributes;
  imageAttributes: ImageAttributes;
  scaleConfig: ScaleConfig;

  /* -------------------------- Current Bounding Box -------------------------- */
  selectedBoxId: string;
  onChangeSelectedBoxId: (boxId: string) => void;
  selectedBoxType: string;
  onChangeSelectedBoxType:(boxType:string) => void;
  notesOpen: boolean;
  onChangeNotesOpen:(bool:boolean) => void;

  /* ---------------------------- Labeling Process ---------------------------- */
  labelingProcess: LabelingProcess;
  onChangeLabelingProcess: (updateAttrs: Partial<LabelingProcess>) => void;
  resetLabelingProcess: () => void;
}

export const useReactToolInternalStore = create<InternalState>(
  devtools(
    (set) => ({
      stageAttributes: {
        x: 0,
        y: 0,
        scaleX: 1,
        scaleY: 1,
      },
      onChangeStageAttributes: (updateAttrs) => {
        set(
          (state) => ({
            ...state,
            stageAttributes: { ...state.stageAttributes, ...updateAttrs },
          }),
          false,
          "ReactToolInternalState/onChangeStageAttributes"
        );
      },
      layerAttributes: { x: 300, y: 150 },
      imageAttributes: { x: 0, y: 0, width: 640, height: 640 },
      scaleConfig: {
        minValue: 1,
        maxValue: 2,
        wheelStep: 1.01,
        buttonStep: 0.1,
      },
      selectedBoxId: "",
      onChangeSelectedBoxId: (boxId) => {
        set(
          (state) => ({ ...state, selectedBoxId: boxId }),
          false,
          "ReactToolInternalState/onChangeSelectedBoxId"
        );
      },
      selectedBoxType:"",
      onChangeSelectedBoxType:(boxType) => {
        set(
          (state) => ({ ...state, selectedBoxType: boxType }),
          false,
          "ReactToolInternalState/onChangeSelectedBoxType"
        );
      },
      notesOpen: false,
      onChangeNotesOpen:(bool:boolean) => {
        set(
          (state) => ({ ...state, notesOpen:bool}),
          false,
          "ReactToolInternalState/onChangeNotesOpen"
        );
      },
      labelingProcess: {
        isLabeling: false,
        labelingType: "",
        labelingColor: "",
        startPoint: undefined,
        endPoint: undefined,
        indicatorLine: undefined,
        indicatorLineColor: "#f0d1a3",
      },
      onChangeLabelingProcess: (updateAttrs) => {
        set(
          (state) => ({
            ...state,
            labelingProcess: { ...state.labelingProcess, ...updateAttrs },
          }),
          false,
          "ReactToolInternalState/onChangeStageAttributes"
        );
      },
      resetLabelingProcess: () => {
        set(
          (state) => ({
            ...state,
            labelingProcess: {
              isLabeling: false,
              labelingType: "",
              labelingColor: "",
              startPoint: undefined,
              endPoint: undefined,
              indicatorLine: undefined,
              indicatorLineColor: "#f0d1a3",
            },
          }),
          false,
          "ReactToolInternalState/resetLabelingProcess"
        );
      },
    }),
    { name: "ReactToolInternalState " }
  )
);
