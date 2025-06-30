// 📂 pages/AdminPanel/utils/filters.ts
import { CollectedImageInterface } from "../../../types/collectedImage";
import { fetchAllImages } from "../../../apis/collectedImage"; 

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


// ✅ Unified filtering function — now fetches all images first
export const applyFilters = async ({
  searchQuery,
  searchType,
  addressFilter,
}: {
  searchQuery: string;
  searchType: "creator" | "labledBy" | "address";
  addressFilter: string;
}): Promise<CollectedImageInterface[]> => {
  try {
    // ✅ Fetch all images from DB (unpaginated)
    const response = await fetchAllImages();
    const allImages = response.data || [];

    // 🧠 Apply filters in memory
    let filteredImages = allImages;

    if (searchType === "creator") {
      filteredImages = filterImagesByCreator(filteredImages, searchQuery);
    } else if (searchType === "labledBy") {
      filteredImages = filterImagesLabeledBy(filteredImages, searchQuery);
    } else if (searchType === "address") {
      filteredImages = filterImagesByLocation(filteredImages, addressFilter);
    }

    return filteredImages;
  } catch (error) {
    console.error("Failed to apply filters:", error);
    return [];
  }
};