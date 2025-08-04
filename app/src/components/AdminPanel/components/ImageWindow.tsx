import React, { useEffect, useRef, useState } from "react";
import { Typography, Box } from "@mui/material";
import { CollectedImageInterface } from "../../../types/collectedImage";
import { formatDate } from "../../../utils/formatDate";

interface ImageWindowProps {
  selectedImage: CollectedImageInterface | null;
}

const ImageWindow: React.FC<ImageWindowProps> = ({ selectedImage }) => {
  const imgRef = useRef<HTMLImageElement>(null);
  const [imgSize, setImgSize] = useState({ width: 0, height: 0 });
  const [naturalSize, setNaturalSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!selectedImage) return;

    if (imgRef.current) {
      const rendered = imgRef.current.getBoundingClientRect();
      setImgSize({ width: rendered.width, height: rendered.height });

      const img = new Image();
      img.onload = () => {
        setNaturalSize({ width: img.width, height: img.height });
      };
      img.src = selectedImage.url;
    }
  }, [selectedImage]);

  if (!selectedImage) return null;

  return (
    <>
      {/* Image with bounding box overlay */}
      <Box sx={{ position: "relative", width: "100%", marginBottom: "1rem" }}>
        <img
          ref={imgRef}
          src={selectedImage.url}
          alt={selectedImage.fileName}
          style={{ width: "100%", display: "block" }}
        />

        {/* Render human_labels[0].labels bunnyboxes */}
        {imgSize.width > 0 &&
          naturalSize.width > 0 &&
          selectedImage.human_labels?.[0]?.labels?.map((label, index) => {
            const { box } = label;
            const scaleX = imgSize.width / naturalSize.width;
            const scaleY = imgSize.height / naturalSize.height;

            return (
              <Box
                key={index}
                sx={{
                  position: "absolute",
                  left: box.x * scaleX,
                  top: box.y * scaleY,
                  width: box.width * scaleX,
                  height: box.height * scaleY,
                  border: "2px solid red",
                  boxSizing: "border-box",
                  zIndex: 1,
                }}
              />
            );
          })}
      </Box>

      {/* Text info */}
      <Typography variant="body1">
        <strong>Creator:</strong> {selectedImage.creator}
      </Typography>
      <Typography variant="body1">
        <strong>Location:</strong>{" "}
        {selectedImage.address || "No address assigned yet"}
      </Typography>
      <Typography variant="body1">
        <strong>Date Created:</strong>{" "}
        {selectedImage?.createdAt ? formatDate(selectedImage.createdAt) : "N/A"}
      </Typography>
      <Typography variant="body1">
        <strong>Date Updated:</strong>{" "}
        {selectedImage?.updatedAt ? formatDate(selectedImage.updatedAt) : "N/A"}
      </Typography>

      {/* Human Labels */}
      <Typography variant="body1" sx={{ mt: 1 }} gutterBottom>
        <strong>Human Labels:</strong>
      </Typography>
      {selectedImage.human_labels?.map((annotator, i) => (
        <Box key={i} sx={{ mb: 2, pl: 1 }}>
          <Typography variant="subtitle1">
            🧑‍💻 <strong>Labeled by:</strong> {annotator.name}
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            📅 <strong>Labeled at:</strong>{" "}
            {annotator.createdAt ? formatDate(annotator.createdAt) : "N/A"}
          </Typography>
          {annotator.labels.map((label, j) => (
            <Box key={j} sx={{ mb: 1, pl: 2, borderLeft: "2px solid #ccc" }}>
              <Typography variant="body2">
                <strong>Label:</strong> {label.label}
                {label.subtype && ` (${label.subtype})`}
              </Typography>
              <Typography variant="body2">
                <strong>Box:</strong> x={label.box.x.toFixed(1)}, y=
                {label.box.y.toFixed(1)}, w={label.box.width.toFixed(1)}, h=
                {label.box.height.toFixed(1)}
              </Typography>
              <Typography variant="body2">
                <strong>Marker POV:</strong> heading=
                {label.markerPov?.heading?.toFixed(1) ?? "N/A"}, pitch=
                {label.markerPov?.pitch?.toFixed(1) ?? "N/A"}, zoom=
                {label.markerPov?.zoom?.toFixed(1) ?? "N/A"}
              </Typography>
              <Typography variant="body2">
                <strong>Exact Coordinates: </strong>
                {label.exactCoordinates?.lat ?? "N/A"},
                {label.exactCoordinates?.lng ?? "N/A"}
              </Typography>
            </Box>
          ))}
        </Box>
      ))}

      {/* Model Labels (optional) */}
      {selectedImage.model_labels && selectedImage.model_labels.length > 0 && (
        <Typography variant="body1" sx={{ mt: 2 }}>
          🤖 <strong>Model Labels: </strong>
          {selectedImage.model_labels.map((label, index) => (
            <Box
              key={index}
              sx={{ mb: 1, pl: 2, borderLeft: "2px solid #ccc" }}
            >
              <Typography variant="body2">
                <strong>Label:</strong> {label.label}
                {label.subtype && ` (${label.subtype})`}
              </Typography>
              <Typography variant="body2">
                <strong>Box:</strong> x={label.box.x.toFixed(1)}, y=
                {label.box.y.toFixed(1)}, w={label.box.width.toFixed(1)}, h=
                {label.box.height.toFixed(1)}
              </Typography>
            </Box>
          ))}
        </Typography>
      )}
    </>
  );
};

export default ImageWindow;
