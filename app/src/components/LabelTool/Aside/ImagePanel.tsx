import React ,{ useState, useEffect } from "react";
import { Button, List, ListItem, Grid, Typography,Pagination,Stack, useMediaQuery,Theme } from "@mui/material";
import { ReactToolAsideTitle } from "../General";
import { useReactToolsStore, ReactToolImageListItemType } from "../state/reactToolState";
import DeleteIcon from "@mui/icons-material/Delete";
import { useUserStore } from "../../../global/userState";
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';


export default function ImagePanel() {
  const {
    reactToolImageList,
    selectedImageId,
    changeSelectedImageId,
    deleteReactToolImage,
    operationsFuncs,
    disableDelete,
  
  } = useReactToolsStore();

  /* -------------------------------------------------------------------------- */
  /*                              Handle User Score                             */
  /* -------------------------------------------------------------------------- */
  const { collectedImgNum, updateCollectedImgNum } = useUserStore();


  // let testArr = createDuplicateArray(40);
  const isWidthBelow1200px = useMediaQuery((theme: Theme) => theme.breakpoints.down('lg')); // large: 1200px
  const isWidthBelow600px = useMediaQuery((theme: Theme) => theme.breakpoints.down('md')); //medium: 900px
  const [pageHeight, setPageHeight] = useState(window.innerHeight);
  const [imagesPerPage, setImagesPerPage] = useState(15);

  const [page, setPage] = React.useState(1);
  
  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };
  const paginationNumber = Math.ceil(reactToolImageList.length/imagesPerPage);

  useEffect(() => {
    
    const handleResize = () => {
      setPageHeight(window.innerHeight);
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  
  
  return (
    <Stack sx={{height: pageHeight-64}}>
      <ReactToolAsideTitle text="images preview" />
      <Stack id="ImagePanelWrap" justifyContent='space-between'>
         {/* Image List Wrapper */}
        <Stack justifyContent='flex-start' sx={{p:2}} spacing={2} id="ImageListWrap">
          {/* <List sx={{ overflowY: "scroll", height: "calc(100vh - 64px - 155px)" }}> */}
          <ImageList sx={{ width: 'auto' }} 
        
            cols={isWidthBelow600px ? 3 : (isWidthBelow1200px ? 6 : 3)} 
            gap={5}>
            { reactToolImageList.slice((page - 1) * imagesPerPage,  page * imagesPerPage).map((item, i) => (
              <ImageListItem 
             
              key={i} 
              sx={
                selectedImageId === item.imageId
                  ? { border: 4, borderColor: "primary.main", p: 1 }
                  : { border: 0, p: 1 }
              }>
                <img
                  src={`${item.imgSrc}?w=100&fit=crop&auto=format`}
                  srcSet={`${item.imgSrc}?w=100&fit=crop&auto=format&dpr=4 4x`}
                  alt={item.imageId}
                  loading="lazy"
                  onClick={() => {
                    changeSelectedImageId(item.imageId);
                  }}
                />
                
              </ImageListItem>
            ))}
            
          </ImageList>
          
        </Stack>
        {/* Pagination Wrapper */ reactToolImageList.length > 15 &&
        <Stack justifyContent='center' alignItems='center'>
          
          <Pagination 
            sx={{my:2, alignContent: 'center'}}
            count={paginationNumber} 
            page={page} 
            onChange={handleChange}
            color="primary" />
        </Stack>
        }
      </Stack>
    </Stack>
  );
}
