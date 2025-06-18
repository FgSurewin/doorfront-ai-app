import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardMedia, Button } from "@mui/material";
import { CollectedImageInterface } from "../../../types/collectedImage";
import { useReactToolsStore } from "../../LabelTool/state/reactToolState";

interface ImageCardProps {
  image: CollectedImageInterface;
  onDelete: (image: CollectedImageInterface) => void;
  onImageClick: (image: CollectedImageInterface) => void;
  onEdit: () => void;
}

const ImageCard: React.FC<ImageCardProps> = ({
  image,
  onDelete,
  onImageClick,
  onEdit,
}) => {
  //load selected image to global state (for LabelTool)
  const navigate = useNavigate();
  const { changeSelectedImageId } = useReactToolsStore();

  const handleEditClick = () => {
    changeSelectedImageId(image.image_id);
    console.log(image.image_id);
    navigate("/adminLabel");
  };

  return (
    <Card sx={{ position: "relative" }}>
      <Button
        variant="contained"
        color="error"
        size="small"
        sx={{ position: "absolute", top: 8, right: 8, zIndex: 1 }}
        onClick={(e) => {
          e.stopPropagation(); // Prevents triggering card click
          onDelete(image);
        }}
      >
        Delete
      </Button>
      <Button
        onClick={handleEditClick}
        variant="contained"
        color="primary"
        size="small"
        sx={{ position: "absolute", top: 8, right: 88, zIndex: 1 }}
      >
        Edit
      </Button>
      <CardMedia
        component="img"
        sx={{ width: "100%", height: "auto", cursor: "pointer" }}
        image={image.url}
        alt={image.fileName}
        onClick={() => onImageClick(image)}
      />
    </Card>
  );
};

export default ImageCard;
