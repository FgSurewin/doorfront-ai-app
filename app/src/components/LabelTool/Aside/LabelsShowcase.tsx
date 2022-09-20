import React from "react";
import {
  Stack,
  List,
  ListItem,
  Typography,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { TypeConfig, useReactToolsStore } from "../state/reactToolState";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import TurnedInIcon from "@mui/icons-material/TurnedIn";
import { useReactToolInternalStore } from "../state/internalState";

export default function LabelsShowcase() {
  /* ----------------------------- Internal State ----------------------------- */
  const { selectedBoxId, onChangeSelectedBoxId, onChangeSelectedBoxType } = useReactToolInternalStore();
  /* --------------------------- Global Image State --------------------------- */
  const {
    reactToolImageList,
    selectedImageId,
    typeConfigs,
    changeReactToolImageLabels,
    deleteReactToolImageLabel,
  } = useReactToolsStore();
  const currentImage = React.useMemo(() => {
    const filterImageList = reactToolImageList.filter(
      (item) => item.imageId === selectedImageId
    );
    return filterImageList[0];
  }, [reactToolImageList, selectedImageId]);

  return (
    <React.Fragment>
      <List
        sx={{
          overflowY: "scroll",
          height: "calc(100vh - 48px - 48px - 41px - 74px)",
        }}
        className="LabelsShowcase"
      >
        {currentImage &&
          currentImage.labels.length > 0 &&
          currentImage.labels.map((label, index) => (
            <ListItem
              key={index}
              button
              divider
              onClick={() => {
                onChangeSelectedBoxId(label.id);
                onChangeSelectedBoxType(label.type);
              }}
            >
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-evenly"
                sx={
                  selectedBoxId === label.id
                    ? { width: "100%", border: 2, borderColor: "primary.main" }
                    : { width: "100%" }
                }
              >
                <TurnedInIcon
                  sx={{ color: getTypeColor(label.type, typeConfigs) }}
                />
                <Typography
                  variant="subtitle2"
                  sx={{ textTransform: "uppercase" }}
                >
                  {label.type}
                </Typography>
                <SelectComponent
                  type={label.type}
                  labelSubtype={label.subtype}
                  onHandleChange={(value) => {
                    changeReactToolImageLabels(label.id, { subtype: value });
                  }}
                />
                <IconButton
                  onClick={(e) => {
                    // e.stopPropagation();
                    changeReactToolImageLabels(label.id, {
                      isVisible: !label.isVisible,
                    });
                  }}
                >
                  {label.isVisible ? <VisibilityOffIcon /> : <VisibilityIcon />}
                </IconButton>
                <IconButton
                  sx={{ color: "red" }}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    deleteReactToolImageLabel(label.id);
                  }}
                >
                  <DeleteForeverIcon />
                </IconButton>
              </Stack>
            </ListItem>
          ))}
      </List>
    </React.Fragment>
  );
}

function SelectComponent({
  type,
  labelSubtype,
  onHandleChange,
}: {
  type: string;
  labelSubtype: string | undefined;
  onHandleChange: (value: string) => void;
}) {
  const { typeConfigs } = useReactToolsStore();
  const subtypeCheck = React.useMemo(() => {
    const result: { hasSubtype: boolean; subtype: string[] | undefined } = {
      hasSubtype: false,
      subtype: undefined,
    };
    typeConfigs.forEach((item) => {
      if (type === item.type) {
        if (item.subtype) {
          result.hasSubtype = true;
          result.subtype = item.subtype;
        }
      }
    });
    return result;
  }, [type, typeConfigs]);

  return (
    <React.Fragment>
      {subtypeCheck.hasSubtype ? (
        <FormControl sx={{ m: 1, minWidth: 120 }} required>
          <InputLabel id="demo-simple-select-helper-label">Subtype</InputLabel>
          <Select
            labelId="demo-simple-select-helper-label"
            id="demo-simple-select-helper"
            value={labelSubtype}
            label="Subtype"
            onChange={(e) => {
              onHandleChange(e.target.value);
            }}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {subtypeCheck.subtype!.map((item, index) => (
              <MenuItem key={index} value={item}>
                {item}
              </MenuItem>
            ))}
          </Select>
          {/* <FormHelperText>Select a subtype</FormHelperText> */}
        </FormControl>
      ) : (
        <FormControl
          sx={{ m: 1, minWidth: 120, cursor: "not-allowed" }}
          disabled
        >
          <InputLabel id="demo-simple-select-helper-label">None</InputLabel>
          <Select
            labelId="demo-simple-select-helper-label"
            id="demo-simple-select-helper"
            value={""}
            label="None"
            sx={{ cursor: "not-allowed" }}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
          </Select>
          {/* <FormHelperText>Has no subtype</FormHelperText> */}
        </FormControl>
      )}
    </React.Fragment>
  );
}

function getTypeColor(type: string, typeConfigs: TypeConfig[]): string {
  let result = "";
  typeConfigs.forEach((item) => {
    if (type === item.type) result = item.color;
  });
  return result;
}
