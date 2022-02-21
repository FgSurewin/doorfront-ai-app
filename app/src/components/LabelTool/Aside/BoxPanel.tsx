import React from "react";
import { ReactToolAsideTitle } from "../General";
import { TypeConfig, useReactToolsStore } from "../state/reactToolState";
import { Divider, List, ListItem, Stack, Typography } from "@mui/material";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import { useReactToolInternalStore } from "../state/internalState";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import KeyboardIcon from "@mui/icons-material/Keyboard";

export default function BoxPanel() {
  const { typeConfigs } = useReactToolsStore();
  const { labelingProcess, onChangeLabelingProcess } =
    useReactToolInternalStore();

  const handleLabelBoxButtonClick = (typeConfig: TypeConfig) => {
    onChangeLabelingProcess({
      isLabeling: true,
      labelingColor: typeConfig.color,
      labelingType: typeConfig.type,
    });
  };

  return (
    <div>
      <ReactToolAsideTitle text="Keyboard Shortcuts" />
      <KeyText keyText="q" description="Quit the labeling mode" />
      <KeyText keyText="d" description="Delete selected bounding box" />
      <ReactToolAsideTitle text="Bounding Box Buttons" />
      <List className="BoxButtonGroup">
        {typeConfigs.length > 0 &&
          typeConfigs.map((item, index) => (
            <ListItem
              key={index}
              disabled={labelingProcess.isLabeling}
              button
              className={`Box-${item.type}`}
              divider
              sx={{
                mb: 1,
              }}
              onClick={() => handleLabelBoxButtonClick(item)}
            >
              <Stack direction="row" alignItems="center" sx={{ width: "100%" }}>
                <CheckBoxOutlineBlankIcon
                  sx={{ mr: 4, color: item.color }}
                  fontSize="large"
                />
                <Typography
                  variant="subtitle1"
                  sx={{ textTransform: "uppercase", flexGrow: 1 }}
                >
                  {item.type}
                </Typography>
                <CheckCircleIcon
                  sx={{
                    color:
                      labelingProcess.labelingType === item.type
                        ? "green"
                        : "lightGray",
                  }}
                />
              </Stack>
            </ListItem>
          ))}
      </List>
    </div>
  );
}

export function KeyText({
  keyText,
  description,
}: {
  keyText: string;
  description: string;
}) {
  return (
    <>
      <Stack
        direction="row"
        sx={{ width: "100%", px: 2, py: 1 }}
        alignItems="center"
        className="KeyText"
      >
        <KeyboardIcon />
        <Typography variant="subtitle2" sx={{ ml: 1 }}>
          Press <span style={{ fontWeight: "bold" }}>{keyText}</span>
        </Typography>
        <Divider orientation="vertical" flexItem sx={{ mx: 2 }} />
        <Typography variant="subtitle2" sx={{ textTransform: "uppercase" }}>
          {description}
        </Typography>
      </Stack>
      <Divider />
    </>
  );
}
