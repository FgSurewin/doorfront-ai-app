import create from "zustand";
import { devtools } from "zustand/middleware";
import { Step } from "react-joyride";
import { explorationSteps } from "./steps/explorationSteps";
import { labelingPageSteps } from "./steps/labelingPageSteps";

const sampleMarkerId = "sampleMarker";

export interface TourState {
  explorationTour: boolean;
  updateExplorationTour: (update: boolean) => void;
  explorationTourStepIndex: number;
  updateExplorationTourStepIndex: (update: number) => void;
  explorationSteps: Step[];
  sampleMarkerId: string;

  labelingPageTour: boolean;
  updateLabelingPageTour: (update: boolean) => void;
  labelingTourStepIndex: number;
  updateLabelingTourStepIndex: (update: number) => void;
  labelingSteps: Step[];
}

export const useTourStore = create<TourState>(
  devtools(
    (set) => ({
      explorationTour: true,
      updateExplorationTour: (update) => {
        set(
          (state) => ({ ...state, explorationTour: update }),
          false,
          "TourState/updateExplorationTour"
        );
      },
      explorationTourStepIndex: 0,
      updateExplorationTourStepIndex: (update) => {
        set(
          (state) => ({ ...state, explorationTourStepIndex: update }),
          false,
          "TourState/updateExplorationTour"
        );
      },

      explorationSteps: explorationSteps,
      sampleMarkerId: sampleMarkerId,

      labelingPageTour: true,
      updateLabelingPageTour: (update) => {
        set(
          (state) => ({ ...state, labelingPageTour: update }),
          false,
          "TourState/updateLabelingPageTour"
        );
      },
      labelingTourStepIndex: 0,
      updateLabelingTourStepIndex: (update) => {
        set(
          (state) => ({ ...state, labelingTourStepIndex: update }),
          false,
          "TourState/updateLabelingTourStepIndex"
        );
      },

      labelingSteps: labelingPageSteps,
    }),
    { name: "TourState" }
  )
);
