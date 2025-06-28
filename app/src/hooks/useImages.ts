import { useState, useEffect } from "react";
import { fetchAllImages, deleteDBImage } from "../apis/collectedImage";
import { CollectedImageInterface } from "../types/collectedImage";

export const useImages = (currentPage: number, imagesPerPage: number) => {
  const [images, setImages] = useState<CollectedImageInterface[]>([]);
  const [totalImages, setTotalImages] = useState<number>(0); // To store the total number of images
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null); // To keep track of the selected image for deletion
  const [openDialog, setOpenDialog] = useState(false); // To control the delete confirmation dialog
  const [selectedImage, setSelectedImage] =
    useState<CollectedImageInterface | null>(null);
  // Pagination logic
  const indexOfLastImage = currentPage * imagesPerPage;
  const indexOfFirstImage = indexOfLastImage - imagesPerPage;

  const getImages = async () => {
    setLoading(true);
    try {
      const response = await fetchAllImages(); // Fetch all images
      if (response.data) {
        const limitedImages = response.data.slice(0, 50); // Only first 50
        setTotalImages(response.data.length); // Still track total
        setImages(limitedImages); // Set only 50 in state
      } else {
        setImages([]);
      }
    } catch (error) {
      console.error("Error fetching images:", error);
      setImages([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getImages(); // Fetch images on mount
  }, []);

  // Function to delete an image
  const handleDelete = (imageId: string) => {
    deleteDBImage({ imageId })
      .then(() => {
        setImages((prevImages) =>
          prevImages.filter((img) => img.image_id !== imageId)
        );
      })
      .catch((error) => {
        console.error("Error deleting image:", error);
      });
  };

  // Function to handle delete confirmation
  const handleDeleteClick = (imageId: string) => {
    setSelectedImageId(imageId);
    setOpenDialog(true); // Open the confirmation dialog
  };

  const handleConfirmDelete = () => {
    if (selectedImageId) {
      handleDelete(selectedImageId); // Call the delete function directly
      setOpenDialog(false); // Close the dialog after delete
      setSelectedImageId(null); // Reset the selected image ID
    }
  };

  const handleCancelDelete = () => {
    setOpenDialog(false); // Close the confirmation dialog without deleting
    setSelectedImageId(null); // Reset the selected image ID
  };
  const handleOpenImageInfo = (image: CollectedImageInterface) => {
    setSelectedImage(image);
  };

  const handleCloseImageInfo = () => {
    setSelectedImage(null); // Close the image info dialog
  };
  return {
    images,
    loading,
    totalImages,
    getImages,
    handleDeleteClick,
    handleConfirmDelete,
    handleCancelDelete,
    openDialog,
    handleOpenImageInfo,
    selectedImage,
    handleCloseImageInfo,
  };
};
