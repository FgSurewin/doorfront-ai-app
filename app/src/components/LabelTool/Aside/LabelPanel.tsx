import React from "react";
import { Button } from "@mui/material";
import { ReactToolAsideTitle } from "../General";
import { useReactToolsStore } from "../state/reactToolState";
import LabelsShowcase from "./LabelsShowcase";
// import OperationSection from "./OperationSection";

export default function LabelPanel() {
  const {
    selectedImageId,
    reactToolImageList,
    operationsFuncs,
    deleteReactToolImage,
    isSubmitting,
    updateIsSubmitting,
  } = useReactToolsStore();
  const handleSubmit = async () => {
    updateIsSubmitting(true);
    const filterImageList = reactToolImageList.filter(
      (item) => item.imageId === selectedImageId
    );
    const currentImage = filterImageList[0];
    if (operationsFuncs.onSubmitImage) {
      await operationsFuncs.onSubmitImage(currentImage);
      deleteReactToolImage(selectedImageId);
      updateIsSubmitting(false);
    }
  };
  return (
    <div>
      {/* <OperationSection /> */}
      <ReactToolAsideTitle text="Submit by Clicking Button Below" />
      <Button
        fullWidth
        variant="contained"
        sx={{
          width: "80%",
          display: "block",
          margin: "0 auto",
          color: "white",
          bgcolor: "#389e0d",
          mb: 1,
          py: 1,
          "&:hover": { bgcolor: "#52c41a" },
        }}
        disabled={selectedImageId === "" || isSubmitting}
        onClick={handleSubmit}
        className="submitLabelButton"
      >
        submit labels
      </Button>
      <ReactToolAsideTitle text="Labels" />
      <LabelsShowcase />
    </div>
  );
}
