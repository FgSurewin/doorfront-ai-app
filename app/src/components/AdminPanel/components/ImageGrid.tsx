import React from "react";
import { Grid } from "@mui/material";
import { CollectedImageInterface } from "../../../types/collectedImage";
import ImageCard from "./ImageCard";

interface ImageGridProps {
  images: CollectedImageInterface[];
  onDelete: (image: CollectedImageInterface) => void; 
  onEdit: (image: CollectedImageInterface) => void; 
  onImageClick: (image: CollectedImageInterface) => void; // Pass the image object
  openDialog: boolean;
  handleConfirmDelete: () => void;
  handleCancelDelete: () => void;
}

const ImageGrid: React.FC<ImageGridProps> = ({
  images,
  onDelete,
  onImageClick,
  openDialog,
  onEdit,
  handleConfirmDelete,
  handleCancelDelete,
}) => {
  return (
    <Grid container spacing={2}>
      {images.map((image) => (
        <Grid item xs={12} sm={6} md={3} key={image.image_id}>
          <ImageCard
            image={image}
            onDelete={() => onDelete(image)} 
            onImageClick={() => onImageClick(image)} 
            onEdit={() => onEdit(image)}
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default ImageGrid;
