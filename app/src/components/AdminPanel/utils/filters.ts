import {
  CollectedImageInterface,
  FetchFilteredImagesParams,
} from "../../../types/collectedImage";
import { fetchFilteredImages } from "../../../apis/collectedImage";
import { CollectedImageApiReturnType } from "../../../utils/api";

export const applyFilters = async ({
  searchQuery,
  searchType,
  addressFilter,
  page = 1,
  limit = 20,
}: FetchFilteredImagesParams & { page?: number; limit?: number }): Promise<{
  images: CollectedImageInterface[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}> => {
  try {
    const response: CollectedImageApiReturnType<CollectedImageInterface[]> =
      await fetchFilteredImages({
        searchQuery,
        searchType,
        addressFilter,
        limit,
        skip: (page - 1) * limit,
      });

    const images = response.data || [];
    const pagination = response.pagination || {
      total: 0,
      limit,
      skip: (page - 1) * limit,
      hasMore: false,
    };
    console.log(pagination.total)
    return {
      images,
      total: pagination.total,
      page,
      limit: pagination.limit,
      hasMore: pagination.hasMore,
    };
  } catch (error) {
    console.error("Failed to fetch filtered images:", error);
    return { images: [], total: 0, page, limit, hasMore: false };
  }
};
