import React, { useRef, useEffect, useState } from "react";
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
  const navigate = useNavigate();
  const { changeSelectedImageId } = useReactToolsStore();
  const imgRef = useRef<HTMLImageElement>(null);
  const [scale, setScale] = useState({ scaleX: 1, scaleY: 1 });

  const handleEditClick = () => {
    changeSelectedImageId(image.image_id);
    navigate(`/adminLabel/${image.image_id}`);
  };

  useEffect(() => {
    const img = imgRef.current;
    if (img && img.complete) {
      const naturalWidth = img.naturalWidth;
      const naturalHeight = img.naturalHeight;
      const renderedWidth = img.clientWidth;
      const renderedHeight = img.clientHeight;

      setScale({
        scaleX: renderedWidth / naturalWidth,
        scaleY: renderedHeight / naturalHeight,
      });
    }
  }, [image.url]);

  return (
    <Card sx={{ position: "relative", mb: 2 }}>
      <Button
        variant="contained"
        color="error"
        size="small"
        sx={{ position: "absolute", top: 8, right: 8, zIndex: 2 }}
        onClick={(e) => {
          e.stopPropagation();
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
        sx={{ position: "absolute", top: 8, right: 88, zIndex: 2 }}
      >
        Edit
      </Button>

      {/* Image container */}
      <div style={{ position: "relative", width: "100%", height: "auto" }}>
        <CardMedia
          component="img"
          image={image.url}
          alt={image.fileName}
          ref={imgRef}
          onLoad={() => {
            const img = imgRef.current;
            if (img) {
              const naturalWidth = img.naturalWidth;
              const naturalHeight = img.naturalHeight;
              const renderedWidth = img.clientWidth;
              const renderedHeight = img.clientHeight;

              setScale({
                scaleX: renderedWidth / naturalWidth,
                scaleY: renderedHeight / naturalHeight,
              });
            }
          }}
          onClick={() => onImageClick(image)}
          sx={{
            width: "100%",
            height: "auto",
            cursor: "pointer",
            display: "block",
          }}
        />

        {/* Draw bounding boxes */}
        {image.human_labels?.[0]?.labels?.map((label, index) => {
          const box = label.box;
          const style = {
            position: "absolute" as const,
            left: box.x * scale.scaleX,
            top: box.y * scale.scaleY,
            width: box.width * scale.scaleX,
            height: box.height * scale.scaleY,
            border: "2px solid red",
            boxSizing: "border-box" as const,
            zIndex: 1,
          };

          return <div key={index} style={style} />;
        })}
      </div>
    </Card>
  );
};

export default ImageCard;
