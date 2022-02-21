import { debounce } from "lodash";
import { generateInfo } from "../../../components/GoogleMap/utils/streetViewTool";
import { StreetViewImageConfig } from "../../../global/explorationState";

/* -------------------------------------------------------------------------- */
/*                             Debounced Function                             */
/* -------------------------------------------------------------------------- */
export const debouncedStreetViewImageChange = debounce(
  (
    result: ReturnType<typeof generateInfo>,
    func: (update: Partial<StreetViewImageConfig>) => void
  ) => {
    if (result.position && result.pov && result.pano && result.zoom) {
      func({
        imagePov: { ...result.pov, zoom: result.zoom },
        imageLocation: result.position,
        panoId: result.pano,
      });
    }
  },
  300
);
