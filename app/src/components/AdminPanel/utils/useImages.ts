import { useState, useEffect } from "react";
import {
  fetchPaginatedImages,
  fetchFilteredImages,
  deleteDBImage,
} from "../../../apis/collectedImage";
import { CollectedImageInterface } from "../../../types/collectedImage";

interface UseImagesParams {
  currentPage: number;
  imagesPerPage: number;
  searchQuery?: string;
  searchType?: "creator" | "labledBy" | "address";
  addressFilter?: string | "";
}

export const useImages = ({
  currentPage,
  imagesPerPage,
  searchQuery = "",
  searchType = "creator",
  addressFilter = "",
}: UseImagesParams) => {
  const [images, setImages] = useState<CollectedImageInterface[]>([]);
  const [totalImages, setTotalImages] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedImage, setSelectedImage] = useState<CollectedImageInterface | null>(null);

  const filtersAreActive = searchQuery.trim() !== "" || addressFilter.trim() !== "";

  useEffect(() => {
    const loadImages = async () => {
      setLoading(true);
      const skip = (currentPage - 1) * imagesPerPage;
      const limit = imagesPerPage;

      try {
        let response;

        if (filtersAreActive) {
          response = await fetchFilteredImages({
            searchQuery,
            searchType,
            addressFilter,
            skip,
            limit,
          });
        } else {
          response = await fetchPaginatedImages({ skip, limit });
        }

        const images = response.data ?? [];
        const total = response.pagination?.total ?? 0;
        const hasMore = response.pagination?.hasMore ?? false;

        setImages(images);
        setTotalImages(total);
        setHasMore(hasMore);
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
  }, [currentPage, imagesPerPage, searchQuery, searchType, addressFilter, filtersAreActive]);

  // ✅ Delete logic
  const handleDelete = async (imageId: string) => {
    try {
      await deleteDBImage({ imageId });
      setImages((prev) => prev.filter((img) => img.image_id !== imageId));
      setTotalImages((prev) => Math.max(0, prev - 1));
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
