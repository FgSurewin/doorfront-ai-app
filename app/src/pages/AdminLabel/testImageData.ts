import { InputLabel } from "../../components/LabelTool";
import { TypeConfig } from "../../components/LabelTool/state/reactToolState";

export interface TestImageDataType {
  imageId: string;
  imgSrc: string;
  fileName: string;
  labels: InputLabel[];
}

export const testTypeConfigs: TypeConfig[] = [
  {
    type: "door",
    color: "#F97F51",
    subtype: ["Single", "Double", "Automatic", "Revolving", "Open"],
  },

  {
    type: "knob",
    color: "#9AECDB",
    subtype: ["Vertical Bar", "Pull", "Round", "Horizontal Bar"],
  },

  {
    type: "ramp",
    color: "#EAB543",
    subtype: undefined,
  },

  {
    type: "stairs",
    color: "#D6A2E8",
    subtype: undefined,
  },
];
