import React from "react";
import { Line } from "react-konva";
import { useReactToolInternalStore } from "../state/internalState";

export default function IndicatorLine() {
  const { labelingProcess, imageAttributes } = useReactToolInternalStore();
  const linePos = React.useMemo(() => {
    const { indicatorLine } = labelingProcess;
    let result = undefined;
    if (indicatorLine) {
      result = { hLine: indicatorLine.y, vLine: indicatorLine.x };
      // Check horizontal line
      if (result.hLine <= imageAttributes.y) result.hLine = imageAttributes.y;
      if (result.hLine >= imageAttributes.height)
        result.hLine = imageAttributes.height;
      // Check vertical line
      if (result.vLine <= imageAttributes.x) result.vLine = imageAttributes.x;
      if (result.vLine >= imageAttributes.width)
        result.vLine = imageAttributes.width;
    }

    return result;
  }, [labelingProcess, imageAttributes]);

  return (
    <React.Fragment>
      {labelingProcess.isLabeling && linePos && (
        <>
          <Line
            id="Horizontal Indicator Line"
            points={[0, linePos.hLine, 640, linePos.hLine]}
            strokeWidth={2}
            stroke={labelingProcess.indicatorLineColor}
            dash={[5, 5]}
          />
          <Line
            id="Vertical Indicator Line"
            points={[linePos.vLine, 0, linePos.vLine, 640]}
            strokeWidth={2}
            stroke={labelingProcess.indicatorLineColor}
            dash={[5, 5]}
          />
        </>
      )}
    </React.Fragment>
  );
}
