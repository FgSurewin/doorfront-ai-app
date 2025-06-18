// 📂 pages/AdminPanel/utils/filters.ts
import { CollectedImageInterface } from "../../../types/collectedImage";

export const filterImagesLabeledBy = (images: CollectedImageInterface[], labledQuery: string) => {
  return images.filter((image) =>
    image.human_labels.some((label) =>
      label.name.toLowerCase().includes(labledQuery.toLowerCase())
    )
  );
};

export const filterImagesByCreator = (images: CollectedImageInterface[], creatorQuery: string) => {
  return images.filter((image) =>
    image.creator.toLowerCase().includes(creatorQuery.toLowerCase())
  );
};

export const filterImagesByLocation = (
  images: CollectedImageInterface[],
  address: string
): CollectedImageInterface[] => {
  if (!address.trim()) return images;

  const normalizedSearch = address.trim().toLowerCase();

  return images.filter((image) => {
    const imageAddress = image.address?.trim().toLowerCase() || "";
    return imageAddress.includes(normalizedSearch);
  });
};


// Unified filtering function
export const applyFilters = async (
  images: CollectedImageInterface[],
  { searchQuery, searchType, addressFilter }: { searchQuery: string; searchType: "creator" | "labledBy" | "address"; addressFilter: string }
) => {
  let filteredImages = images;

  if (searchType === "creator") {
    filteredImages = filterImagesByCreator(filteredImages, searchQuery);
  } else if (searchType === "labledBy") {
    filteredImages = filterImagesLabeledBy(filteredImages, searchQuery);
  } else if (searchType === "address") {
    filteredImages = await filterImagesByLocation(filteredImages, addressFilter);
  }

  return filteredImages;
};
