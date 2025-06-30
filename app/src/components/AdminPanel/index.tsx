import React, { useState, useEffect, useMemo } from "react";
import {
  Pagination,
  Container,
  Dialog,
  Typography,
  DialogContent,
  DialogActions,
  Button,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useImages } from "./utils/useImages";
import DialogConfirmDelete from "./components/DialogConfirmDelete";
import SearchFilters from "./components/SearchFilters";
import { applyFilters } from "./utils/filters";
import { CollectedImageInterface } from "../../types/collectedImage";
import ImageGrid from "./components/ImageGrid";
import AccessLevel from "./components/AccessLevel";
import UserList from "./components/UserList";
import ImageWindow from "./components/ImageWindow";

const AdminPanel = () => {
  // Local state for search and filter
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState<
    "creator" | "labledBy" | "address"
  >("creator");
  const [addressFilter, setAddressFilter] = useState("");
  const [filteredImages, setFilteredImages] = useState<
    CollectedImageInterface[]
  >([]);

  const [openAdminDialog, setOpenAdminDialog] = useState(false);
  const [openUserListDialog, setOpenUserListDialog] = useState(false);
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [imagesPerPage, setImagesPerPage] = useState(16);

  const {
    images,
    totalImages,
    handleDeleteClick,
    handleConfirmDelete,
    handleCancelDelete,
    openDialog,
    handleOpenImageInfo,
    selectedImage,
    handleCloseImageInfo,
  } = useImages(currentPage, imagesPerPage);

  const filtersAreActive = searchQuery !== "" || addressFilter !== "";

  // Handle page change for pagination
  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setCurrentPage(value);
  };

  // Handle search and filter changes
  const handleSearchQueryChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setSearchQuery(e.target.value);
  const handleAddressFilterChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setAddressFilter(e.target.value);
  const handleSearchTypeChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setSearchType(e.target.value as "creator" | "labledBy" | "address");

  // Filter images when search or filter options change
  useEffect(() => {
    const fetchFilteredImages = async () => {
      if (filtersAreActive) {
        const result = await applyFilters({
          searchQuery,
          searchType,
          addressFilter,
        }); // This should call the DB for all matches
        setFilteredImages(result);
        setCurrentPage(1);
      } else {
        setFilteredImages([]); // Return to paginated mode
      }
    };

    fetchFilteredImages();
  }, [searchQuery, searchType, addressFilter]);

  // 🧠 Paginate filtered results or fallback to default paginated images
  const displayImages = filtersAreActive ? filteredImages : images;

  const paginatedImages = useMemo(() => {
    if (filtersAreActive) {
      // Client-side paginate filtered images
      return filteredImages.slice(
        (currentPage - 1) * imagesPerPage,
        currentPage * imagesPerPage
      );
    }
    // Server-side paginated images - use as is, no slicing
    return images;
  }, [filtersAreActive, filteredImages, images, currentPage, imagesPerPage]);

  // 🧠 Display correct total count for pagination
  const totalImageCount = filtersAreActive
    ? filteredImages.length
    : totalImages;

  //handle images to edit
  const navigate = useNavigate();

  const handleEditClick = (image: CollectedImageInterface) => {
    if (image?.url) {
      console.log(image?.url);
      navigate("/adminlabel", { state: { imageSrc: image.url } });
    }
  };

  const handleAddAdminClick = () => {
    // Open the dialog when "Add Admin" button is clicked
    setOpenAdminDialog(true);
  };

  const handleUserListClick = () => {
    // Open the dialog when "Add Admin" button is clicked
    setOpenUserListDialog(true);
  };

  const handleCloseDialog = () => {
    // Close the dialog
    setOpenAdminDialog(false);
    setOpenUserListDialog(false);
  };
  return (
    <Container
      maxWidth={false}
      sx={{ paddingLeft: 2, paddingRight: 2, paddingTop: 2, marginBottom: 3 }}
    >
      <SearchFilters
        searchQuery={searchQuery}
        searchType={searchType}
        addressFilter={addressFilter}
        onSearchTypeChange={handleSearchTypeChange}
        onSearchQueryChange={handleSearchQueryChange}
        onLabelFilterChange={handleSearchQueryChange}
        onAddressFilterChange={handleAddressFilterChange}
      />

      <Typography
        sx={{
          position: "absolute",
          top: "140px",
          right: "20px",
          padding: 1,
          borderRadius: 2,
        }}
      >
        Total Images: {totalImageCount}
      </Typography>

      <Button
        variant="contained"
        onClick={handleAddAdminClick}
        style={{
          position: "absolute",
          top: "100px",
          right: "40px",
          backgroundColor: "#2980b9",
          color: "white",
        }}
      >
        Add Admin
      </Button>
      <Button
        variant="contained"
        onClick={handleUserListClick}
        style={{
          position: "absolute",
          top: "100px",
          right: "180px",
          backgroundColor: "#27ae60",
          color: "white",
        }}
      >
        Users List
      </Button>
      <ImageGrid
        images={paginatedImages}
        onEdit={handleEditClick}
        onDelete={(image) => handleDeleteClick(image.image_id)}
        handleConfirmDelete={handleConfirmDelete}
        handleCancelDelete={handleCancelDelete}
        openDialog={openDialog}
        onImageClick={handleOpenImageInfo}
      />

      {totalImageCount > imagesPerPage && (
        <Pagination
          count={Math.ceil(totalImageCount / imagesPerPage)}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
          sx={{ marginTop: 2 }}
        />
      )}

      {/* Dialog for delete confirmation */}
      <DialogConfirmDelete
        open={openDialog}
        onConfirm={handleConfirmDelete}
        onClose={handleCancelDelete}
      />
      {/* Image Info Dialog */}
      <Dialog open={Boolean(selectedImage)} onClose={handleCloseImageInfo}>
        <DialogContent>
          <ImageWindow selectedImage={selectedImage} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseImageInfo} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
      {/* Admin Rights Dialog */}
      <Dialog open={openAdminDialog} onClose={handleCloseDialog}>
        <AccessLevel onClose={handleCloseDialog} />
      </Dialog>
      {/* User List */}
      <Dialog
        open={openUserListDialog}
        onClose={handleCloseDialog}
        maxWidth="xl"
      >
        <UserList onClose={handleCloseDialog} />
      </Dialog>
    </Container>
  );
};

export default AdminPanel;
