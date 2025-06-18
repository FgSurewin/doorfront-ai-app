import React, { useState, useEffect } from "react";
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
import { useImages } from "../../hooks/useImages";
import DialogConfirmDelete from "./components/DialogConfirmDelete";
import SearchFilters from "./components/SearchFilters";
import { applyFilters } from "./utils/filters";
import { CollectedImageInterface } from "../../types/collectedImage";
import ImageGrid from "./components/ImageGrid";
import AccessLevel from "./components/AccessLevel";
import UserList from "./components/UserList";
import ImageWindow from "./components/ImageWindow";


//fetch address of image in format of Streen number/name/zip

const AdminPanel = () => {

  // Local state for search and filter
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState<"creator" | "labledBy" | "address">(
    "creator"
  );
  const [addressFilter, setAddressFilter] = useState("");
  const [filteredImages, setFilteredImages] = useState<
    CollectedImageInterface[]
  >([]);

  const [openAdminDialog, setOpenAdminDialog] = useState(false);
  const [openUserListDialog, setOpenUserListDialog] = useState(false);
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [imagesPerPage, setImagesPerPage] = useState(16);
  const paginatedImages = filteredImages.slice(
    (currentPage - 1) * imagesPerPage,
    currentPage * imagesPerPage
  );
  const [address, setAddress] = useState<string | null>(null);

  const {
    images,
    handleDeleteClick,
    handleConfirmDelete,
    handleCancelDelete,
    openDialog,
    handleOpenImageInfo,
    selectedImage,
    handleCloseImageInfo,
  } = useImages(currentPage, imagesPerPage);

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
    const filterImages = async () => {
      const filtered = await applyFilters(images, {
        searchQuery,
        searchType,
        addressFilter,
      });
      setFilteredImages(filtered);
      setCurrentPage(1); // Reset to first page on filter change
    };

    filterImages();
  }, [images, searchQuery, searchType, addressFilter]);
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
  
      <Typography sx={{
          position: "absolute",
          top: "140px",
          right: "20px",
          padding: 1,
          borderRadius: 2,
        }}>
        Total Images: {images.length}
      </Typography>

      <Button
        variant="contained"
        onClick={handleAddAdminClick}
        style={{
          position: "absolute",
          top: "100px",
          right: "40px", 
          backgroundColor: "#2980b9",
          color: "white"
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
          color: "white"
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
        onImageClick={handleOpenImageInfo} // Pass the function to handle image click
      />

      {/* Pagination Component */}
      {filteredImages.length > imagesPerPage && (
        <Pagination
          count={Math.ceil(filteredImages.length / imagesPerPage)}
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
          <ImageWindow selectedImage={selectedImage}/>
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
      <Dialog open={openUserListDialog} onClose={handleCloseDialog} maxWidth="xl" >
        <UserList onClose={handleCloseDialog} />
      </Dialog>
    </Container>
  );
};

export default AdminPanel;
