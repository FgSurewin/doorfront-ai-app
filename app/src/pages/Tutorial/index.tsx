import React from 'react'
import {Box, Tab, Typography, Tabs, Grid} from '@mui/material'
import {useState,} from "react";
import {Intro, Junior, Pivot, Ramdom, Validate, Labeling, Panels} from './Images';
import Navbar from '../../components/Navbar';


export default function Tutorial() {

  const [value, setValue] = useState(0)
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    // console.warn(newValue)
    setValue(newValue)
  }

  const videoLink = process.env.REACT_APP_TUTORIAL_VIDEO
  const videoRef = React.useRef<HTMLVideoElement>(null);
  return (

    <div>
      <Navbar/>
      <Grid container spacing={2} sx={{mt: "4px"}}>
        <Grid item xs={2}>
          <Box>
            <Tabs value={value}
                  onChange={handleChange}
                  orientation='vertical'
            >
              <Tab label="Introduction"/>
              <Tab label="how to explore nyc"/>
              <Tab label="how to label storfronts"/>
              <Tab label="how validate labels"/>
              <Tab label="Video tutorial" />

            </Tabs>

          </Box>
        </ Grid>
        <Grid item xs={10}>
          <Box ml={2}>
            <Grid item xs={10}>
            <TabPanel value={value} index={0}>
              <Typography sx={{mb: 2, textAlign: "left"}}>

                <Typography variant="h5" sx={{mb: 2, textAlign: "left"}}>Introduction</Typography>
                DoorFront uses a crowdsourcing method to obtain the data required to build navigation
                software that will improve traveling for visually impaired people. The data collected
                by DoorFront consists of
                geospatial information of doors, stairs, ramps, doorknobs around NYC. Anyone is welcome
                to use DoorFront to contribute to a new, meaningful cause.
                With DoorFront, you can virtually walk through the entire city of New
                York while you can collect accessibility information on storefront. The work you do
                helps not only the community, but the city as a whole.
                <Intro/>
                <br/>
                <Typography variant="h5" sx={{mb: 2, textAlign: "left"}}>Badge and Ranking
                  System</Typography>
                As you collect accessibility information on different storefronts, you will accrue
                points. <br/>
                Different action receive a different number of points. Users with the most credits are
                displayed on the leaderboard.
                <Typography> <b>Query image:</b> +1 point</Typography>
                <Typography> <b>Correct (Modify) other's labels:</b> +1 point</Typography>
                <Typography> <b>Validate other's labels:</b> +1 point</Typography>
                <Typography> <b>Find treasures:</b> +10 points </Typography>
                <Typography> <b>Query image:</b> +1 point </Typography>

                Friendly reminder: DoorFront has buried many treasures in New York
                City, find them and earn extra points. The more pictures you query,
                the better your chances of finding the treasure. Take action,
                adventurers!
              </Typography>
            </TabPanel>
            </Grid>
            <Grid item xs={10}>

                <TabPanel value={value} index={1}>
                  <Typography>
                  <Typography variant="h5" sx={{mb: 2, textAlign: "left"}}>How to Use the Arrow
                    Feature</Typography>

                  The arrow has its heads oriented in the cardinal directions within Google Street View, going
                  left, right, forward, and backward.
                  In the middle of the block, the arrow has only 2 heads. At the intersection, the arrow has 4
                  heads pointed to
                  each direction left/right/forward/backward. So, if one want to change the street with the
                  arrow feature
                  you just need to push it to the intersection.

                  <Junior/>
                  <br/>
                  <Typography variant="h5" sx={{mb: 2, textAlign: "left"}}>How to Use Drag & Drop
                    Feature</Typography>

                  If one wants to quickly move to a specific position on the map, you can use the drag/drop
                  feature to move
                  on the map. You can drag the pivot on the map
                  and drop it any area and Google Street View will take you there.

              <Pivot/>
              <br/>
              <Typography variant="h5" sx={{mb: 2, textAlign: "left"}}> How To Randomly Change Street View
                Location </Typography>
               If one wish to randomly change its current location in Google Street View,
                there is a command at the right corner on the bottom on the exploration page called "Change
                street view location".
                Pressing this command will instantly change the starting point of google street view to a
                different location.

              <Ramdom/>
              <br/>
              <Typography variant="h5" sx={{mb: 2, textAlign: "left"}}>Video of Instructions:</Typography>
               This video shows in recording how both features are used
                to successfully explore the city. What's better than visualizing the instructions in
                action? <br/>

              <div><br/></div>
              <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>

                <video controls autoPlay width="90%" height="90%">
                  <source src={process.env.REACT_APP_TUTORIAL_ONE}/>
                </video>

              </Box>
                  </Typography>
            </TabPanel>

        </Grid>
        <Grid item xs={10}>
          <TabPanel value={value} index={2}>
            <Typography variant="h5" sx={{mb: 2, mr: 20, textAlign: "left"}}>Step 1: Capture
              storefront</Typography>
            <Typography>
              Within the exploration page of DoorFront, you can explore the city using Google Street View.
              To capture a storefront,
              you can position your Google Street View to have a better position for a screenshot of the
              storefront.
              Make sure all the accessibility object are visible on the screen and then click on the
              button called
              "Capture current image & AI label" located on the bottom right of your screen in the
              exploration page.
              Once the image has been captured, DoorFront has an AI label system that will automatically
              identify all the accessibility objects
              on the image and label them. Users must go to labeling page to edit and confirm the AI
              labels to make sure the AI labels are accurate.
            </Typography>
            <br/>
            <Typography variant="h5" sx={{mb: 2, textAlign: "left"}}>Step 2: Edit and Confirm AI
              labels </Typography>
            <Typography>
              To access the AI labels on the current captured images, User can click on the button "edit
              and confirm AI labels"
              below the button "Capture current image & AI label" to open the labeling page. User can also
              capture more than one images,
              carry them to the labeling page at once to edit and confirm the AI labels on these images.
            </Typography>

            <Labeling/>
            <br/>
            <Typography>
              Once the user opens the labeling page, DoorFront offers several tools to properly edit and
              confirm all the labels.
            </Typography>
            <Typography>
              Users have the option to resize or switch the image
            </Typography>
            <Typography>
              On the left side of the screen, users can click and open the image panel where users can
              browse queried images.
            </Typography>
            <Typography>
              Click and open label panel where users can browse all labels within an image and submit
              them.
            </Typography>
            <Typography>
              Click and open the Box panel where user can select the type of box for specific object type
              to draw on the
              image.
            </Typography>
            <Panels/>

            <Typography sx={{mb: 2, mr: 20, textAlign: "left"}}>
              <Typography variant="h6">
                Keyboard:
              </Typography>
              Press q to quit the labeling mode <br/>
              Press d to delete selected bounding box <br/>
              Press c to duplicate selected bounding box
            </Typography>
            <Typography variant="h5" sx={{mb: 2, textAlign: "left"}}>Video of Instructions</Typography>
            <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <video controls autoPlay width="90%" height="90%">
                <source src={process.env.REACT_APP_TUTORIAL_TWO}/>
              </video>
            </Box>
          </TabPanel>
        </Grid>
        <Grid item xs={10}>
          <TabPanel value={value} index={3}>
            <Typography sx={{mb: 2, textAlign: "left"}}>
              As previously stated, DoorFront offers a preliminary AI labeling feature of queried images
              once they are captured from Google Street View.
              However, these labels are not always accurate, either some accessibility objects are left
              out or some
              are wrongly labeled. To alleviate this, DoorFront offers an additional opportunity for users
              to validate submitted labels by confirming the bounding boxes locations and labels.


              <Typography variant="h5" sx={{mb: 2, mt: 2, textAlign: "left"}}> How to Find Submitted
                Labels </Typography>

              On every page of DoorFront, there is a button on the navigation bar called "Validate
              Labels". When you click on the "Validate Labels" button, an interface opens where users
              can
              go through the images that have been already labels and submitted. This allows users to
              look over other users work to fix
              mistakes they have made or missed.
              You can also encounter storefronts that have been already collecting while you are
              exploring the city google street view
              in DoorFront.

              <Validate/>
            </Typography>

          </TabPanel>
        </Grid>
            <Grid item xs={10}>
              <TabPanel value={value} index={4}>
                <Box
                  sx={{
                    position: {
                      sm: "relative",
                      xs: "static",
                    }
                  }}
                >
                  <video
                    src={videoLink}
                    ref={videoRef}
                    controls
                    style={{width:"100%", height:"100%"}}
                  />
                </Box>
              </TabPanel>
            </Grid>

      </Box>
    </Grid>
</Grid>
</div>
)
}


interface TabPanelProps {

  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {

  const {children, value, index, ...other} = props

  return (
    <div {...other}>
      {

        value == index && (
          <h1>{children}</h1>
        )
      }


    </div>
  )
}

