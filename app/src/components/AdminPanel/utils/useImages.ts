import { useState, useEffect } from "react";
import {
  fetchPaginatedImages,
  deleteDBImage,
} from "../../../apis/collectedImage";
import { CollectedImageInterface } from "../../../types/collectedImage";

export const useImages = (currentPage: number, imagesPerPage: number) => {
  const [images, setImages] = useState<CollectedImageInterface[]>([]);
  const [totalImages, setTotalImages] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedImage, setSelectedImage] =
    useState<CollectedImageInterface | null>(null);

  // ✅ Fetch paginated images when page or page size changes
  useEffect(() => {
    const loadImages = async () => {
      setLoading(true);
      const skip = (currentPage - 1) * imagesPerPage;
      const limit = imagesPerPage;

      try {
        const response = await fetchPaginatedImages({ limit, skip });
        const images = response.data ?? [];
        const pagination = response.pagination ?? { total: 0, hasMore: false };

        setImages(images);
        setTotalImages(pagination.total);
        setHasMore(pagination.hasMore);
      } catch (error) {
        console.error("Error fetching images:", error);
        setImages([]);
        setTotalImages(0);
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    };

    loadImages();
  }, [currentPage, imagesPerPage]);

  const handleDelete = async (imageId: string) => {
    try {
      await deleteDBImage({ imageId });
      setImages((prev) => prev.filter((img) => img.image_id !== imageId));
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };

  const handleDeleteClick = (imageId: string) => {
    setSelectedImageId(imageId);
    setOpenDialog(true);
  };

  const handleConfirmDelete = () => {
    if (selectedImageId) {
      handleDelete(selectedImageId);
      setOpenDialog(false);
      setSelectedImageId(null);
    }
  };

  const handleCancelDelete = () => {
    setOpenDialog(false);
    setSelectedImageId(null);
  };

  const handleOpenImageInfo = (image: CollectedImageInterface) => {
    setSelectedImage(image);
  };

  const handleCloseImageInfo = () => {
    setSelectedImage(null);
  };

  return {
    images,
    loading,
    totalImages,
    hasMore,
    handleDeleteClick,
    handleConfirmDelete,
    handleCancelDelete,
    openDialog,
    handleOpenImageInfo,
    selectedImage,
    handleCloseImageInfo,
  };
};
