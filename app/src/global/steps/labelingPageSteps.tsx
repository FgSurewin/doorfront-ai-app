import { Box, Typography } from "@mui/material";
import { Step } from "react-joyride";

export const labelingPageSteps: Step[] = [
  {
    content: (
      <Box>
        <Typography variant="h5" sx={{ mb: 2, textAlign: "left" }}>
          🎉 Welcome to labeling page
        </Typography>
        <Typography variant="body1" sx={{ mb: 2, textAlign: "left" }}>
          In this page, you can easily annotate your queried images. 😊
        </Typography>
        <Typography variant="body1" sx={{ textAlign: "left" }}>
          🥰 Now, Let me guild you through the workflow
        </Typography>
      </Box>
    ),
    placement: "center",
    target: ".LabelingTool",
    disableCloseOnEsc: true,
    disableOverlayClose: true,
    showSkipButton: true,
    hideCloseButton: true,
    spotlightClicks: false,
  },
  {
    content: (
      <Box>
        <Typography variant="h5" sx={{ mb: 2, textAlign: "left" }}>
          🍇 Resize Image
        </Typography>
        <Typography variant="body1" sx={{ mb: 2, textAlign: "left" }}>
          😊 Try to click these two buttons to resize the image
        </Typography>
      </Box>
    ),
    placement: "auto",
    target: ".resizeImageButton",
    disableCloseOnEsc: true,
    disableOverlayClose: true,
    showSkipButton: true,
    hideCloseButton: true,
    spotlightClicks: true,
  },
  {
    content: (
      <Box>
        <Typography variant="h5" sx={{ mb: 2, textAlign: "left" }}>
          🍋 Switch Image
        </Typography>
        <Typography variant="body1" sx={{ mb: 2, textAlign: "left" }}>
          😊 Try to click these two buttons to switch the image
        </Typography>
      </Box>
    ),
    placement: "auto",
    target: ".switchImageButton",
    disableCloseOnEsc: true,
    disableOverlayClose: true,
    showSkipButton: true,
    hideCloseButton: true,
    spotlightClicks: true,
  },
  {
    content: (
      <Box>
        <Typography variant="h5" sx={{ mb: 2, textAlign: "left" }}>
          🍑 Main Operation Area
        </Typography>
        <Typography variant="body1" sx={{ mb: 2, textAlign: "left" }}>
          😊 Welcome to our labeling stage. In this stage, you can control
          either image or label.
        </Typography>
        <Typography variant="body1" sx={{ mb: 2, textAlign: "left" }}>
          ☑️ Resize image: scroll your mouse wheel or press resize buttons
        </Typography>
        <Typography variant="body1" sx={{ mb: 2, textAlign: "left" }}>
          ✅ Control label: click one of the labels and play around with it
        </Typography>
      </Box>
    ),
    placement: "auto",
    target: ".labelStage",
    disableCloseOnEsc: true,
    disableOverlayClose: true,
    showSkipButton: true,
    hideCloseButton: true,
    spotlightClicks: true,
  },
  {
    content: (
      <Box>
        <Typography variant="h5" sx={{ mb: 2, textAlign: "left" }}>
          🍉 Image Tab Button
        </Typography>
        <Typography variant="body1" sx={{ mb: 2, textAlign: "left" }}>
          😊 CLick this button to open image panel where you can browse queried
          images.
        </Typography>
      </Box>
    ),
    placement: "auto",
    target: ".Images-button",
    disableCloseOnEsc: true,
    disableOverlayClose: true,
    showSkipButton: true,
    hideCloseButton: true,
    spotlightClicks: true,
  },
  {
    content: (
      <Box>
        <Typography variant="h5" sx={{ mb: 2, textAlign: "left" }}>
          🥭 Label Tab Button
        </Typography>
        <Typography variant="body1" sx={{ mb: 2, textAlign: "left" }}>
          😊 CLick this button to open label panel where you can browse all{" "}
          <strong>labels</strong> within this image.
        </Typography>
      </Box>
    ),
    placement: "auto",
    target: ".Label-button",
    disableCloseOnEsc: true,
    disableOverlayClose: true,
    showSkipButton: true,
    hideCloseButton: true,
    spotlightClicks: true,
    hideFooter: true,
  },
  {
    content: (
      <Box>
        <Typography variant="h5" sx={{ mb: 2, textAlign: "left" }}>
          🍏 Labels
        </Typography>
        <Typography variant="body1" sx={{ mb: 2, textAlign: "left" }}>
          😊 For door and doorknob, we hope you can identify the{" "}
          <strong>subtype</strong> for us. You can select a suitable option
          through the select box.
        </Typography>
      </Box>
    ),
    placement: "auto",
    target: ".LabelsShowcase",
    disableCloseOnEsc: true,
    disableOverlayClose: true,
    showSkipButton: true,
    hideCloseButton: true,
    hideBackButton: true,
    spotlightClicks: true,
  },
  {
    content: (
      <Box>
        <Typography variant="h5" sx={{ mb: 2, textAlign: "left" }}>
          🍓 Confirm Button
        </Typography>
        <Typography variant="body1" sx={{ mb: 2, textAlign: "left" }}>
          😊 Confirm all the labels and send them to DoorFront database.
        </Typography>
        <Typography
          variant="body1"
          sx={{
            mb: 2,
            textAlign: "left",
            color: "darkred",
            fontWeight: "bold",
          }}
        >
          😊 (You can click it after the guild tour)
        </Typography>
      </Box>
    ),
    placement: "auto",
    target: ".submitLabelButton",
    disableCloseOnEsc: true,
    disableOverlayClose: true,
    showSkipButton: true,
    hideCloseButton: true,
    spotlightClicks: false,
  },
  {
    content: (
      <Box>
        <Typography variant="h5" sx={{ mb: 2, textAlign: "left" }}>
          🍒 Box Tab Button
        </Typography>
        <Typography variant="body1" sx={{ mb: 2, textAlign: "left" }}>
          😊 Click this button to open the Boxes panel, where you can create
          different types of enclosing boxes.
        </Typography>
      </Box>
    ),
    placement: "auto",
    target: ".Box-button",
    disableCloseOnEsc: true,
    disableOverlayClose: true,
    showSkipButton: true,
    hideCloseButton: true,
    spotlightClicks: true,
    hideBackButton: true,
    hideFooter: true,
  },
  {
    content: (
      <Box>
        <Typography variant="h5" sx={{ mb: 2, textAlign: "left" }}>
          🍅 Label Box Button
        </Typography>
        <Typography variant="body1" sx={{ mb: 2, textAlign: "left" }}>
          😊 Annotate with our pre-defined four types:{" "}
          <strong>door, doorknob, stairs and ramp</strong>.
        </Typography>
        <Typography
          variant="body1"
          sx={{
            mb: 2,
            textAlign: "left",
            color: "darkred",
            fontWeight: "bold",
          }}
        >
          😊 (You can click it after the guild tour)
        </Typography>
      </Box>
    ),
    placement: "auto",
    target: ".BoxButtonGroup",
    disableCloseOnEsc: true,
    disableOverlayClose: true,
    showSkipButton: true,
    hideCloseButton: true,
    spotlightClicks: false,
    hideBackButton: true,
  },
  {
    content: (
      <Box>
        <Typography variant="h5" sx={{ mb: 2, textAlign: "left" }}>
          🍅 Keyboard Shortcut
        </Typography>
        <Typography variant="body1" sx={{ mb: 2, textAlign: "left" }}>
          😊 DoorFront also provides keyboard shortcut for convenience.
        </Typography>
      </Box>
    ),
    placement: "auto",
    target: ".KeyText",
    disableCloseOnEsc: true,
    disableOverlayClose: true,
    showSkipButton: true,
    hideCloseButton: true,
    spotlightClicks: false,
    hideBackButton: false,
  },
  {
    content: (
      <Box>
        <Typography variant="h5" sx={{ mb: 2, textAlign: "left" }}>
          🥬 Exit Button
        </Typography>
        <Typography variant="body1" sx={{ mb: 2, textAlign: "left" }}>
          😊 To make sure you have successfully checked all the query images,
          you are not allowed to leave unless you have submitted all of them.
        </Typography>
        <Typography
          variant="body1"
          sx={{
            mb: 2,
            textAlign: "left",
            fontWeight: "bold",
          }}
        >
          😊 (Press{" "}
          <strong style={{ color: "darkgreen" }}>submit labels</strong> button
          to submit label information before you leave)
        </Typography>
        <Typography
          variant="body1"
          sx={{
            mb: 2,
            textAlign: "left",
            fontWeight: "bold",
          }}
        >
          😊 However, if you are in modification mode, you can exit at any time
        </Typography>
      </Box>
    ),
    placement: "auto",
    target: ".exitButton",
    disableCloseOnEsc: true,
    disableOverlayClose: true,
    showSkipButton: true,
    hideCloseButton: true,
    spotlightClicks: false,
    hideBackButton: false,
  },
  {
    content: (
      <Box>
        <Typography variant="h5" sx={{ mb: 2, textAlign: "left" }}>
          🌰 Over
        </Typography>
        <Typography variant="body1" sx={{ mb: 2, textAlign: "left" }}>
          😊 Now, it's your time to finish the labeling task.
        </Typography>
      </Box>
    ),
    placement: "center",
    target: ".LabelingTool",
    disableCloseOnEsc: true,
    disableOverlayClose: true,
    showSkipButton: true,
    hideCloseButton: true,
    spotlightClicks: false,
    hideBackButton: false,
  },
];
