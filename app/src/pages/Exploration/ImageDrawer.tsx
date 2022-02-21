import React from "react";
import SaveIcon from "@mui/icons-material/Save";
import EmptyFigure from "../../images/taken.svg";
import {
  Badge,
  Box,
  Button,
  Drawer,
  Fab,
  Stack,
  Typography,
} from "@mui/material";
import {
  QueryImageType,
  useQueryImagesStore,
} from "../../global/queryImagesState";
import { deleteImage } from "../../firebase/uploadImage";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import { deleteAllLocal } from "../../utils/localStorage";
import { deleteDBImage } from "../../apis/collectedImage";
import { useUserStore } from "../../global/userState";
import { deleteUnLabelImage, getUnLabelImageList } from "../../apis/user";

export default function ImageDrawer() {
  /* --------------------------- Query images state --------------------------- */
  const { queryImageList, deleteQueryImage, addDBQueryImage } =
    useQueryImagesStore();
  const { userInfo } = useUserStore();

  /* -------------------------------------------------------------------------- */
  /*                              Drawer properties                             */
  /* -------------------------------------------------------------------------- */
  const [isOpen, setIsOpen] = React.useState(false);
  const toggleDrawer =
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }

      setIsOpen(open);
    };
  /* -------------------------------------------------------------------------- */

  React.useEffect(() => {
    async function internalFunc() {
      const result = await getUnLabelImageList({ id: userInfo.id! });
      if (result.code === 0) {
        addDBQueryImage(result.data);
      }
    }
    internalFunc();
  }, [addDBQueryImage, userInfo.id]);

  return (
    <>
      <Box
        className="ImageDrawer"
        component="div"
        sx={{
          m: 1,
          position: "absolute",
          right: "5%",
          bottom: "5%",
        }}
      >
        <Badge
          color="secondary"
          badgeContent={queryImageList.length}
          showZero
          overlap="circular"
        >
          <Fab
            aria-label="save"
            color="primary"
            sx={{ color: "white" }}
            onClick={toggleDrawer(true)}
          >
            <SaveIcon />
          </Fab>
        </Badge>
      </Box>
      <Drawer anchor="right" open={isOpen} onClose={toggleDrawer(false)}>
        <Stack direction="column" sx={{ px: 6, py: 4 }} spacing={2}>
          <QueryImageListShowcase
            queryImageList={queryImageList}
            deleteQueryImage={deleteQueryImage}
          />
        </Stack>
      </Drawer>
    </>
  );
}

/* -------------------------------------------------------------------------- */
/*                               React Component                              */
/* -------------------------------------------------------------------------- */
function QueryImageListShowcase({
  queryImageList,
  deleteQueryImage,
}: {
  queryImageList: QueryImageType[];
  deleteQueryImage: (id: string) => void;
}) {
  /* ------------------------------ Global State ------------------------------ */
  const { clearUserInfo, userInfo, collectedImgNum, updateCollectedImgNum } =
    useUserStore();

  /* --------------------- React Router Navigate Function --------------------- */
  const navigate = useNavigate();

  /* ------------------------------ Notification ------------------------------ */
  const { enqueueSnackbar } = useSnackbar();
  /* -------------------------------------------------------------------------- */
  if (queryImageList.length === 0) {
    return <EmptyShowcase />;
  }

  return (
    <>
      {queryImageList.map((item) => (
        <Stack
          key={item.imageId}
          direction="row"
          justifyContent="space-between"
          // alignItems="center"
        >
          <Box component="img" src={item.imgSrc} sx={{ width: "300px" }} />
          <Button
            variant="contained"
            sx={{
              color: "white",
              bgcolor: "#f5222d",
              "&:hover": { bgcolor: "#ff4d4f" },
            }}
            onClick={async () => {
              try {
                // Delete zustand state
                deleteQueryImage(item.imageId);
                // Delete firebase storage image
                await deleteImage(item.fileName);
                //TODO Delete database image
                await deleteDBImage(
                  { imageId: item.imageId },
                  {
                    clearUserInfo,
                    navigate,
                    deleteAllLocal,
                  }
                );
                //TODO Delete DB UnLabelImage property
                await deleteUnLabelImage({
                  id: userInfo.id!,
                  data: {
                    imageId: item.imageId,
                    fileName: item.fileName,
                    imgSrc: item.imgSrc,
                  },
                });
                // * Delete user collected score
                updateCollectedImgNum(collectedImgNum - 1);
                // Notification
                enqueueSnackbar("Delete image successfully", {
                  variant: "warning",
                });
              } catch (e) {
                const error = e as Error;
                enqueueSnackbar(error.message, {
                  variant: "error",
                });
              }
            }}
          >
            delete
          </Button>
        </Stack>
      ))}
    </>
  );
}

/* -------------------------------------------------------------------------- */
/*                               React Component                              */
/* -------------------------------------------------------------------------- */
function EmptyShowcase() {
  return (
    <Stack
      direction="column"
      justifyContent="center"
      alignItems="center"
      sx={{ width: "400px", height: "80vh" }}
    >
      <Box
        component="img"
        alt="EmptyFigure"
        src={EmptyFigure}
        sx={{ width: "50%", mb: 3 }}
      />
      <Typography variant="h4">The storage is empty...</Typography>
    </Stack>
  );
}
