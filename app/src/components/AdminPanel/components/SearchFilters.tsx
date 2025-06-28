import React from "react";
import {
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
  Select,
  MenuItem,
  InputLabel,
} from "@mui/material";

interface SearchFiltersProps {
  searchType: "creator" | "labledBy" | "address"; // Add "address" to the searchType
  searchQuery: string;
  addressFilter: string;
  onSearchTypeChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSearchQueryChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onLabelFilterChange: (event: any) => void;
  onAddressFilterChange: (event: React.ChangeEvent<HTMLInputElement>) => void; // New function for address filter
}

const SearchFilters: React.FC<SearchFiltersProps> = ({
  searchType,
  searchQuery,
  addressFilter, 
  onSearchTypeChange,
  onSearchQueryChange,
  onLabelFilterChange,
  onAddressFilterChange, // New function
}) => {
  return (
    <div>
      <FormControl component="fieldset" sx={{ marginBottom: 2 }}>
        <FormLabel component="legend">Search By</FormLabel>
        <RadioGroup row value={searchType} onChange={onSearchTypeChange}>
          <FormControlLabel value="creator" control={<Radio />} label="Creator" />
          <FormControlLabel value="labledBy" control={<Radio />} label="Labled By" />
          <FormControlLabel value="address" control={<Radio />} label="Address" /> {/* Added address option */}
        </RadioGroup>
      </FormControl>

      {searchType === "creator" && (
        <TextField
          label="Search by Creator"
          variant="outlined"
          fullWidth
          value={searchQuery}
          onChange={onSearchQueryChange}
          sx={{ marginBottom: 2 }}
        />
      )}

      {searchType === "labledBy" && (
        <TextField
        label="Search Labled by"
        variant="outlined"
        fullWidth
        value={searchQuery}
        onChange={onSearchQueryChange}
        sx={{ marginBottom: 2 }}
      />
      )}

      {searchType === "address" && (
        <TextField
          label="Search by Address"
          variant="outlined"
          fullWidth
          value={addressFilter} // New filter state
          onChange={onAddressFilterChange} // New handler for address input
          sx={{ marginBottom: 2 }}
        />
      )}
    </div>
  );
};

export default SearchFilters;
