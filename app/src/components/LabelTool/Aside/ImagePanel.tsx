import React from "react";
import { Button, List, ListItem, Grid } from "@mui/material";
import { ReactToolAsideTitle } from "../General";
import { useReactToolsStore } from "../state/reactToolState";
import DeleteIcon from "@mui/icons-material/Delete";
import { useUserStore } from "../../../global/userState";

export default function ImagePanel() {
  const {
    reactToolImageList,
    selectedImageId,
    changeSelectedImageId,
    deleteReactToolImage,
    operationsFuncs,
    disableDelete,
  } = useReactToolsStore();

  /* -------------------------------------------------------------------------- */
  /*                              Handle User Score                             */
  /* -------------------------------------------------------------------------- */
  const { collectedImgNum, updateCollectedImgNum } = useUserStore();

  return (
    <div>
      <ReactToolAsideTitle text="images preview" />
      <List sx={{ overflowY: "scroll", height: "calc(100vh - 41px - 80px)" }}>
        {reactToolImageList.length > 0 &&
          reactToolImageList.map((item) => (
            <ListItem
              key={item.imageId}
              sx={{
                mb: 1,
              }}
              button
              divider
              onClick={() => {
                changeSelectedImageId(item.imageId);
              }}
            >
              <Grid
                container
                direction="column"
                alignItems="center"
                sx={
                  selectedImageId === item.imageId
                    ? { border: 4, borderColor: "primary.main", p: 1 }
                    : { border: 0, p: 1 }
                }
              >
                <Grid
                  item
                  component="img"
                  alt={item.imageId}
                  src={item.imgSrc}
                  sx={{
                    width: "inherit ",
                  }}
                />
                {!disableDelete && (
                  <Grid
                    item
                    component={Button}
                    variant="outlined"
                    startIcon={<DeleteIcon />}
                    sx={{
                      width: "inherit",
                      my: 1,
                    }}
                    onClick={async (e: React.MouseEvent) => {
                      e.stopPropagation();

                      // TODO Export a delete function to parent component...
                      const filterImageList = reactToolImageList.filter(
                        (image) => image.imageId === item.imageId
                      );
                      const currentImage = filterImageList[0];
                      if (operationsFuncs.onDeleteImage) {
                        await operationsFuncs.onDeleteImage(currentImage);
                      }
                      deleteReactToolImage(item.imageId);
                      // * Delete user collected score
                      updateCollectedImgNum(collectedImgNum - 1);
                    }}
                  >
                    Delete
                  </Grid>
                )}
              </Grid>
            </ListItem>
          ))}
      </List>
    </div>
  );
}
